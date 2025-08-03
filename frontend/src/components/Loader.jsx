const Loader = ({ classname }) => {
  return (
    <div className={`${classname} flex items-center justify-center`}>
      <span className={`loading loading-dots loading-lg text-lg`}></span>
    </div>
  );
};

export default Loader;
