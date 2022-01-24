import { useEffect, useRef } from "react";
import { useSnackbar } from "notistack";
import { useAppDispatch, useAppSelector } from "./redux-hooks";
import { removeSnackbar } from "../../redux/data/data.actions";

const useNotifier = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state) => state.data.notifications);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const displayed = useRef<string[]>([]);

  useEffect(() => {
    console.log(notifications);
    console.log("at beginning displaying: ", displayed.current);
    const storeDisplayed = (id: string) => {
      displayed.current = [...displayed.current, id];
    };

    const removeDisplayed = (id: string) => {
      displayed.current = [...displayed.current.filter((key) => id !== key)];
    };

    notifications.forEach(({ key, message }) => {
      // if (dismissed) {
      //   // dismiss snackbar using notistack
      //   closeSnackbar(options.key);
      //   return;
      // }

      // do nothing if snackbar is already displayed
      if (displayed.current.includes(key)) return;

      // display snackbar using notistack
      enqueueSnackbar(message, {
        key: key,
        onClose: (event, reason, myKey) => {
          // if (options.onClose) {
          //   options.onClose(event, reason, myKey);
          // }
        },
        onExited: (event, myKey) => {
          // remove this snackbar from redux store
          dispatch(removeSnackbar({ key: myKey.toString() }));
          removeDisplayed(myKey.toString());
        },
      });

      // keep track of snackbars that we've displayed
      storeDisplayed(key);

      console.log("at the end displaying: ", displayed.current);
    });
  }, [notifications, closeSnackbar, enqueueSnackbar, dispatch, displayed]);
};

export default useNotifier;
