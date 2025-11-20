import { useUserStore } from "@/app/store/user";
import { EModalKey } from "@/shared/types/enums";
import { useModal } from "@ebay/nice-modal-react";
import { useCallback } from "react";

const useEventHandler = <TArgs extends unknown[]>(
  cb: (...args: TArgs) => void
) => {
  const isAuth = useUserStore((state) => state.isAuth);
  const { show } = useModal(EModalKey.SING_UP);

  return useCallback(
    (...args: TArgs) => {
      if (isAuth) {
        cb(...args);
      } else {
        show();
      }
    },
    [isAuth, show, cb]
  );
};

export default useEventHandler;
