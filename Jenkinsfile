pipeline {
    agent any

    tools {
        nodejs 'Node-25'
    }

    environment {
        IMAGE_TAG = "${env.BUILD_NUMBER}"
    }

    stages {
        
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install pnpm') {
            steps {
                sh 'npm install -g pnpm'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'pnpm install'
            }
        }

        stage('Prisma Generate') {
            steps {
                sh 'pnpm --filter @eventhub/backend exec prisma generate'
            }
        }

        stage('Tests') {
            parallel {
                stage('Backend Tests') {
                    steps {
                        sh 'pnpm --filter @eventhub/backend run test'
                    }
                }
                stage('Frontend Tests') {
                    steps {
                        sh 'pnpm --filter @eventhub/frontend run test'
                    }
                }
            }
        }

        stage('Build') {
            steps {
                sh 'pnpm run build'
            }
        }

        stage('Docker Build') {
            parallel {
                stage('Build Backend Image') {
                    steps {
                        sh 'docker build -f packages/backend/Dockerfile -t abdallah714/eventhub-backend:latest .'
                    }
                }
                stage('Build Frontend Image') {
                    steps {
                        sh 'docker build -f packages/frontend/Dockerfile -t abdallah714/eventhub-frontend:latest .'
                    }
                }
                stage('Build Nginx Image') {
                    steps {
                        sh 'docker build -f Dockerfile.nginx -t abdallah714/eventhub-nginx:latest .'
                    }
                }
            }
        }

        stage('Docker Push') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                    sh 'docker push abdallah714/eventhub-backend:latest'
                    sh 'docker push abdallah714/eventhub-frontend:latest'
                    sh 'docker push abdallah714/eventhub-nginx:latest'
                }
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker compose -p eventhub -f docker-compose.prod.yml pull'
                sh 'docker compose -p eventhub -f docker-compose.prod.yml up -d --remove-orphans'
            }
        }
    }

    post {
        always  { echo "Build #${env.BUILD_NUMBER} terminé" }
        success { echo 'Tous les tests passent !' }
        failure { echo 'Des tests ont échoué.' }
    }
}
