interface Props {
  name: string;
  price: number;
}

export const ProductCard = ({ name, price }: Props) => (
  <div className="card">
    <h3>{name}</h3>
    <p>${price}</p>
    <button>Ver detalle</button> {/* Sin funcionalidad aún */}
  </div>
);