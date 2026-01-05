import { useAuth } from "@/context/AuthContext";
import AccessDenied from "./AccessDenied";

interface WithPermissionProps {
  children: React.ReactNode;
  module: string;
  require?: 'view' | 'create' | 'edit';
}

export default function WithPermission({ children, module, require = 'view' }: WithPermissionProps) {
  const { canView, canCreate, canEdit } = useAuth();

  let hasAccess = false;

  switch (require) {
    case 'view':
      hasAccess = canView(module);
      break;
    case 'create':
      hasAccess = canCreate(module);
      break;
    case 'edit':
      hasAccess = canEdit(module);
      break;
  }

  if (!hasAccess) {
    return <AccessDenied />;
  }

  return <>{children}</>;
}
