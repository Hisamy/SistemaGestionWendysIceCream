import PinkRectangle from '../../components/main_content/PinkRectangle.jsx';
import ProductosGrid from './ProductosGrid.jsx';

const PRODUCTOS_MOCK = [
    { id: 1, name: 'Fresada' },
    { id: 2, name: 'Nieve cono' },
    { id: 3, name: 'Frappe' },
    { id: 4, name: 'Nieve vaso' },
    { id: 5, name: 'Sundae'},
    { id: 6, name: 'Banana Split'},
  ];

function ProductosRectanguloGrid(){
    return(
        <PinkRectangle searchable={true}>
        <ProductosGrid
          productos={PRODUCTOS_MOCK}
          onConsumibleClick={handleProductoClick}
          selectedId={selectedConsumible?.id}
        />
      </PinkRectangle>
    );
    
}

export default ProductosRectanguloGrid;