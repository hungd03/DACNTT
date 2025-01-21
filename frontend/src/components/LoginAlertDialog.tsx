import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface LoginAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogin: () => void;
  title?: string;
  description?: string;
  cancelText?: string;
  loginText?: string;
}

const LoginAlertDialog = ({
  open,
  onOpenChange,
  onLogin,
  title = "Please login to continue",
  description = "You need to log in to proceed with checkout or apply a coupon.",
  cancelText = "Close",
  loginText = "Login",
}: LoginAlertDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onLogin}
            className="bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            {loginText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LoginAlertDialog;
