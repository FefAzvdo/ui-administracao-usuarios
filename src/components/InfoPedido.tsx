export default function InfoPedido({
  label,
  value,
}: {
  label: string;
  value: string | undefined;
}) {
  return (
    <span className="text-xl text-gray-400 font-semibold">
      {label}
      <span className="font-bold text-gray-500">{value}</span>
    </span>
  );
}
