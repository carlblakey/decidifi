import { MdCancel } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants";

const SubscriptionModal = () => {
  const navigate = useNavigate();

  const handleOnClick = (route) => {
    navigate(route);
  };
  return (
    <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box bg-white relative">
        {/* Close button as a cross icon */}
        <button
          className="absolute top-2 right-2 text-gray-600 text-xl"
          onClick={() => document.getElementById("my_modal_5").close()}
        >
          <MdCancel />
        </button>

        <h3 className="font-bold text-lg">Do You Already Have an Account?</h3>
        <p className="py-2 text-gray-600">
          To proceed with the subscription, please log in or register.
        </p>

        <div className="modal-action">
          {/* Proceed to Login Button */}
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => handleOnClick(ROUTES.SIGIN)}
          >
            Proceed to Login
          </button>
          {/* Proceed to Sign Up Button */}
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={() => handleOnClick(ROUTES.SIGNUP)}
          >
            Proceed to Sign Up
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default SubscriptionModal;
