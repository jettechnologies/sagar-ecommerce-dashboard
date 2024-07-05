import Modal from "@/components/Modal";
import React, { useState, useRef, useEffect } from "react";
import { MailOpen } from "lucide-react";

interface PasscodeModalType {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  activePasscodeIndex: number;
  setActivePasscodeIndex: React.Dispatch<React.SetStateAction<number>>;
  passcode: string[];
  setPasscode: React.Dispatch<React.SetStateAction<string[]>>;
  handlePasscodeSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

const PasscodeModal = ({
  isOpen,
  setIsOpen,
  activePasscodeIndex,
  setActivePasscodeIndex,
  passcode,
  setPasscode,
  handlePasscodeSubmit,
}: PasscodeModalType) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  let currentPasscodeIndex = 0;

  const handleOnChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = target;
    const newPasscode = [...passcode];
    newPasscode[currentPasscodeIndex] = value.substring(value.length - 1);

    if (!value) setActivePasscodeIndex(currentPasscodeIndex - 1);
    else setActivePasscodeIndex(currentPasscodeIndex + 1);

    setPasscode(newPasscode);
  };

  const handleOnKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") setActivePasscodeIndex(currentPasscodeIndex - 1);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [activePasscodeIndex]);

  return (
    <Modal
      className="max-w-lg"
      isOpen={isOpen}
      handleModalOpen={() => setIsOpen(false)}
      title="Configure Payment Gateway"
    >
      <div className="w-full">
        <form
          className="bg-white rounded-md shadow-2xl p-5 mt-6"
          onSubmit={async (e) => {
            setLoading(true);
            await handlePasscodeSubmit(e);
            setLoading(false);
          }}
        >
          <div className="flex flex-col gap-y-4 items-center justify-center mb-8">
            <div className="w-[96px] grid place-items-center bg-[#d6d5d5] aspect-square rounded-full shadow-sm">
              <MailOpen size={60} strokeWidth={1} />
            </div>
            <p className="font-semibold text-size-400 text-blue w-[80%] text-center">
              Please enter the 8 digits passcode before signup
            </p>
          </div>
          <div className="flex flex-col gap-y-2 mb-8">
            <div className="flex gap-1 md:gap-3 xl:gap-5 justify-center py-2">
              {passcode.map((_, index) => (
                <React.Fragment key={index}>
                  <input
                    ref={activePasscodeIndex === index ? inputRef : null}
                    type="number"
                    className={`w-10 h-10 border-2 rounded bg-transparent outline-none text-center font-semibold text-xl spin-button-none ${
                      error ? "border-red-500" : "border-[#d0d0d0]"
                    } focus-within:border-blue text-gray-400 transition`}
                    onChange={handleOnChange}
                    onKeyDown={(e) => handleOnKeyDown(e)}
                    value={passcode[index]}
                  />
                </React.Fragment>
              ))}
            </div>
            {error && (
              <p className="text-red-500 text-size-400 font-normal m-2 text-center">
                {error}
              </p>
            )}
          </div>
          <div className="w-full">
            <button
              disabled={loading}
              type="submit"
              className="px-10 py-4 w-full rounded-md font-roboto text-size-500 uppercase font-semibold bg-black text-white"
            >
              {loading ? "Loading..." : "Verify passcode"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default PasscodeModal;
