export const Spin = () => (
  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
);

export default function Loading() {
  return (
    <div className="absolute top-0 left-0 flex items-center justify-center h-[100dvh] w-full">
      <Spin />
    </div>
  );
}
