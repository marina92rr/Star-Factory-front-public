import React, { useEffect } from 'react'
import { CategoryAddNew } from '../components/storePage/CategoryAddNew'
import { CategoryModal } from '../components/storePage/CategoryModal'
import { useCategoryStore } from '../../hooks/useCategoryStore'
import { useProductStore } from '../../hooks/useProductStore'
import { ProductAddNew } from '../components/storePage/ProductAddNew'
import { ProductModal } from '../components/storePage/ProductModal'
import { IVAProduct } from '../../helpers/IVAProduct'
import { ProductDelete } from '../components/storePage/ProductDelete'
import { ProductEdit } from '../components/storePage/ProductEdit'
import { onLoadProduct } from '../../store/storeFactory/productSlice'
import { useDispatch } from 'react-redux'
import { CategoryEdit } from '../components/storePage/CategoryEdit'
import { CategoryDelete } from '../components/storePage/CategoryDelete'


export const StorePage = () => {

  const dispatch = useDispatch();
  const { starLoadingCategories, categories, activeCategory, setActiveCategory } = useCategoryStore();
  const { products, startLoadingProductsByCategory, activeProduct } = useProductStore();


  useEffect(() => {

    starLoadingCategories();

  }, [activeProduct]);

  return (

    <div className='m-5 fade-in'>
      <div className='py-5 '>
        <h1>Tienda</h1>
    <hr />
      </div>
    

      <div className=' d-flex'>
        <div className='col-3' >
          <div className='border bg-light rounded-top p-3'>
            <CategoryAddNew />
            <CategoryModal />
          </div>
          <table className="table border rounded-top">

            <tbody>
              <tr>
                <td>
                  {categories.map((category, i) => {
                    return (
                      <div key={i} className=" text-start">
                        <div className='d-flex'>
                          <div
                            className='text p-2 w-100'
                            style={{
                              cursor: 'pointer',
                              background: activeCategory?._id === category._id ? '#007bff' : 'none',
                              color: activeCategory?._id === category._id ? '#ffffff' : '#000000'

                            }}
                            onClick={() => {
                              if (activeCategory?._id === category._id) {
                                setActiveCategory(null);
                                dispatch(onLoadProduct([])); // limpiar productos
                              } else {
                                setActiveCategory(category);
                                startLoadingProductsByCategory(category._id);
                              }
                            }}
                          >
                            {category.name}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className='col-8 ms-4' >
          <div className='border bg-light rounded-top justify-content-between align-items-center p-3'>
            {activeCategory ? (
              <h3>{activeCategory.name}</h3>
            )
              : (
                <h3 className='text-muted'>Productos</h3>
              )}
          </div>
          {activeCategory ? (
            <div className='border rounded-top  d-flex justify-content-between align-items-center p-3'>
              <ProductAddNew />
              <ProductModal />
              <div className='align-items-end d-flex gap-2'>
                <CategoryEdit />
                <CategoryDelete />
              </div>
            </div>
          ) : (
            <div></div>
          )}

          <table className="table border ">
            <thead >
              <tr >
                <th scope='col' className="p-3 text-start">Nombre</th>
                <th scope='col' className="p-3 text-end">PVP</th>
                <th scope='col' className="p-3 text-end">IVA</th>
                <th scope='col' className="p-3 text-center">Editar/Borrar</th>

              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-muted">No hay Productos en esta categoría</td>
                </tr>
              ) : (
                products.map((product, i) => {
                  const { iva, total } = IVAProduct(product.price);
                  return (
                    <tr key={i}>
                      <td className='text-primary p-3 text-start'>{product.name}</td>
                      <td className="p-3 text-end">{total}€</td>
                      <td className="p-3 text-end">{iva}€</td>
                      <td >
                        <div className='d-flex justify-content-center align-items-center gap-2'>
                          <ProductEdit product={product} />
                          <ProductDelete product={product} />
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

        </div>
      </div>
    </div>

  )
}
export default StorePage;
