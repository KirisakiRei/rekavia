import { Navigate, useParams } from 'react-router-dom'
import { buildSapatamuPublicPreviewUrl } from '@/lib/sapatamu-public-preview'

export function SapatamuThemePreviewPage() {
  const { themeId = '' } = useParams()
  const previewUrl = buildSapatamuPublicPreviewUrl(themeId)

  if (!previewUrl) {
    return <Navigate to="/produk/sapatamu#katalog" replace />
  }

  return <Navigate to={previewUrl} replace />
}
