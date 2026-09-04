import {Toaster} from "react-hot-toast";
const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className="font-poppins antialiased">{children}</body>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style:{
            background:"#000000",
            color:"#fff",
          },
        }}
      />
    </html>
  );
};
export default RootLayout;