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
    }

    post {
        always  { echo "Build #${env.BUILD_NUMBER} terminé" }
        success { echo 'Tous les tests passent !' }
        failure { echo 'Des tests ont échoué.' }
    }
}
