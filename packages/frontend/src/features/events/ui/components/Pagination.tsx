interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
      <button onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
        ← Précédent
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          style={{ fontWeight: p === page ? 'bold' : 'normal' }}
        >
          {p}
        </button>
      ))}

      <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>
        Suivant →
      </button>
    </div>
  )
}
