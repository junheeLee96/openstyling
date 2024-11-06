export default function Loading() {
  return (
    <div className="w-full h-[40px] px-4 py-2 rounded-md  flex justify-center items-center">
      <div className="font-extrabold text-white mr-4">
        잠시만 기다려주세요...
      </div>
      <div className="loader" />
      {/* <img
        src="/loading4.gif"
        alt="Animated GIF"
        style={{
          width: "10%",
          height: "100%",
        }}
      /> */}
    </div>
  );
}
