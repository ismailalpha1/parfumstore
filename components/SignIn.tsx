import { Show, SignInButton } from "@clerk/nextjs";

const SignIn = () => {
  return (
    <Show when="signed-out">
      <SignInButton mode="modal">
        <button className="text-sm font-semibold hover:text-darkColor text-lightColor hover:cursor-pointer hoverEffect">
          login
        </button>
      </SignInButton>
    </Show>
  );
};

export default SignIn;
