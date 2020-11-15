import swal from "sweetalert";

export default function statusMessage(success, message) {
  if (success) {
    swal({
      title: "Success!",
      text: message,
      icon: "success",
      buttons: false,
      timer: 2000,
    });
  } else {
    swal({
      title: "Oh no!",
      text: message,
      icon: "error",
      buttons: false,
      timer: 2000,
    });
  }
}
