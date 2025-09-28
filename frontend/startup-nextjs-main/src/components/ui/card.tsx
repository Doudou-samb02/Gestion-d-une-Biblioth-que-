export const Card = ({ children, className }: any) => (
  <div className={`bg-white shadow-lg rounded-2xl ${className}`}>{children}</div>
);

export const CardContent = ({ children, className }: any) => (
  <div className={`p-8 ${className}`}>{children}</div>
);
