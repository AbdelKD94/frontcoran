type WhyThisResultBoxProps = {
  reason: string;
};

export function WhyThisResultBox({ reason }: WhyThisResultBoxProps) {
  return (
    <div className="why-block">
      <span>Pourquoi ce résultat ?</span>
      <p>{reason}</p>
    </div>
  );
}
