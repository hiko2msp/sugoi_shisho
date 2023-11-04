import Search from '../app/features/search';

const Popup = () => {
  document.body.className = 'w-[30rem] h-[15rem]';

  return (
    <>
      <div className="flex justify-center mt-2 text-base">開いているページについて聞いてください</div>
      <Search />
    </>
  );
};

export default Popup;
