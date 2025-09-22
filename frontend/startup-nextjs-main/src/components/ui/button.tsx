export const Button = ({ children, className, ...props }: any) => {
  return (
    <button
      className={`px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
