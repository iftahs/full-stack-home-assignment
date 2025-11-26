import { SpinnerIcon } from '../../assets/icons/SpinnerIcon';

export const Spinner = ({ className = "", size = "sm" }: { className?: string; size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "h-5 w-5",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <SpinnerIcon
      className={`animate-spin ${sizeClasses[size]} ${className}`}
    />
  );
};
