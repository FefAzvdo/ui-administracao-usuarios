type Props = {
  title: string;
};

export default function Title({ title }: Props) {
  return <h1 className="text-white font-black text-4xl mb-4">{title}</h1>;
}
