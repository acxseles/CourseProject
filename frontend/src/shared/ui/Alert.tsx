interface AlertProps {
  type: 'error' | 'success' | 'info';
  children: React.ReactNode;
  className?: string;
}

export const Alert = ({ type, children, className = '' }: AlertProps) => {
  const colors = {
    error: 'bg-red-50 border-red-200 text-red-700',
    success: 'bg-green-50 border-green-200 text-green-700',
    info: 'bg-blue-50 border-blue-200 text-blue-700',
  };

  return (
    <div className={`p-4 rounded-xl border ${colors[type]} ${className}`}>
      {children}
    </div>
  );
};