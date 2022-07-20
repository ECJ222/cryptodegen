const ListenForOutsideClick = (listening: boolean, setListening: (arg0: boolean) => void, elementToListenRef: { current: { contains: (arg0: EventTarget | null) => any; }; }, handleClickOutside: () => void) => {
  return () => {
    if (listening) return
    if (!elementToListenRef.current) return;

    setListening(true)

      ;[`click`, `touchstart`].forEach((type) => {
        document.addEventListener(`click`, (event) => {
          if (elementToListenRef.current && elementToListenRef.current.contains(event.target)) return

          handleClickOutside()
        });
      });
  }
}

export default ListenForOutsideClick
