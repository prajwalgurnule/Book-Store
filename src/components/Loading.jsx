import Lottie from "lottie-react";
import LoadingAnimation from "../assets/loading.json";

const Loading = () => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <Lottie
        animationData={LoadingAnimation}
        loop={true}
        style={{ width: 400, height: 400 }}
      />
    </div>
  );
};

export default Loading;
