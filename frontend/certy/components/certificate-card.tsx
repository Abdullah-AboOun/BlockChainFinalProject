import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileCheck, Calendar, User, Building2 } from "lucide-react"
import Link from "next/link"
import type { StoredCertificate } from "@/lib/storage"

interface CertificateCardProps {
  certificate: StoredCertificate
  showActions?: boolean
}

export function CertificateCard({ certificate, showActions = true }: CertificateCardProps) {
  return (
    <Card className="p-6">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <FileCheck className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">{certificate.recipientName}</h3>
            <p className="text-sm text-muted-foreground">{certificate.certificateType}</p>
          </div>
        </div>
        <Badge variant={certificate.isRevoked ? "destructive" : "default"}>
          {certificate.isRevoked ? "Revoked" : "Valid"}
        </Badge>
      </div>

      <div className="mb-4 space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Building2 className="h-4 w-4" />
          <span>{certificate.issuerName}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Issued: {new Date(certificate.issueDate).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <User className="h-4 w-4" />
          <span>{certificate.recipientEmail}</span>
        </div>
      </div>

      <div className="mb-4 rounded-md bg-muted p-3">
        <p className="text-xs text-muted-foreground">Certificate ID</p>
        <p className="font-mono text-sm">{certificate.id}</p>
      </div>

      {showActions && (
        <Button variant="outline" className="w-full bg-transparent" asChild>
          <Link href={`/verify?id=${certificate.id}`}>View Details</Link>
        </Button>
      )}
    </Card>
  )
}
