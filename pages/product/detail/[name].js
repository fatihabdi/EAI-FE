import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";

import { hasCookie, getCookie } from "cookies-next";

import {
  Row,
  Col,
  Carousel,
  Typography,
  Button,
  InputNumber,
  Divider,
  notification,
} from "antd";
const { Title, Text } = Typography;
import styled from "styled-components";

import { EndPoint, CartApi, ProductsList } from "../../../SystemApis";

//Use Redux
import { useDispatch, useSelector } from "react-redux";

import PublicLayout from "../../../layouts/PublicLayout";

//Styling components
const ProductDetailPicture = styled.img`
  width: 20vw;
`;

const ProductDetailCarousel = styled.div`
  width: 20vw;
  float: right;
`;

const ItemSizeRadio = styled(Button)`
  margin: 0 0.25vw;
  border-radius: 5px;
  &.selected {
    background-color: #143f5d;
    color: white;
  }
`;

const ProductDetailBox = styled.div`
  padding-left: 3vw;
  padding-top: 1vh;
`;

const ProductDetailDivider = styled(Divider)`
  width: 15vw;
  min-width: 15vw;
`;

const SPSlideShow = styled.div`
  padding: 1vw;
`;

const SPImage = styled.img`
  width: 100%;
  height: 100%;
  border: 1px solid lightgray;
`;

function DetailProductPage() {
  const dispatch = useDispatch();
  const selector = useSelector;
  //const wishlistArr = selector(wishlistItems);

  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [productDetail, setProductDetail] = useState("");
  const [sizeOptions, setSizeOptions] = useState([]);
  const [productPictures] = useState([]);

  const [itemSize, setItemSize] = useState("s");
  const qtyInput = useRef(1);

  const router = useRouter();
  const { name } = router.query;
  console.log(name);

  const formatNumberCurrency = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  useEffect(() => {
    fetch(EndPoint + ProductsList + "?name=" + name.replace(/%20/g, " "))
      .then((response) => response.json())
      .then((data) => {
        console.log(data.data[0]);
        setProductName(data.data[0].name);
        setPrice(
          "Rp. " + formatNumberCurrency(data.data[0].price ? data.data[0].price : 0)
        );
        setProductDetail(data.data[0].description);
        setSizeOptions(data.data[0].size);
      });
  }, []);

  /* const AddWishlistHandler = () => {
        setFaves(true);
        dispatch(addItemWishlistHandler({itemId: router.query.productId}));
    }
    const RemoveWishlistHandler = () => {
        setFaves(false);
        dispatch(removeItemWishlistHandler({itemId: router.query.productId}));
    }*/

  const AddCartHandler = () => {
    //console.log("test");
    //console.log(qtyInput.current.value);
    //console.log(itemSize);

    if (!itemSize || qtyInput.current.value < 1) {
      notification["error"]({
        message: "Add to cart Failed",
        description: "Please check your input!",
      });
    } else {
      if (!hasCookie("userToken")) {
        notification["error"]({
          message: "Add to cart Failed",
          description: "You have to login first!",
        });

        setTimeout(function () {
          router.push("/Login");
        }, 3000);
      } else {
        fetch(EndPoint + CartApi, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: getCookie("userToken"),
          },
          body: JSON.stringify({
            id: router.query.productId,
            quantity: qtyInput.current.value,
            size: itemSize,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            //console.log(data);
            if (
              data.message.indexOf("success") == -1 ||
              data.message.indexOf("add") == -1
            ) {
              notification["error"]({
                message: "Add to cart Failed",
                description: data.message,
              });
            } else {
              notification["success"]({
                message: "Add to cart Success",
                description: data.message,
              });
            }
          });
      }
    }
    //dispatch(addChangeItemCartHandler({ itemId: router.query.productId, size: itemSize, qty: qtyInput.current.value, type: "add" }));
  };

  return (
    <PublicLayout title="Detail Product Page">
      <Row gutter={16}>
        <Col className="gutter-row" span={8}>
          <ProductDetailCarousel>
            <Carousel autoplay>
              {productPictures.map((pPicture) => {
                return (
                  <div key={"ProductDetailPics" + pPicture}>
                    <ProductDetailPicture src={EndPoint + pPicture} />
                  </div>
                );
              })}
              {/*<div>
                                <ProductDetailPicture src="https://images.tokopedia.net/img/cache/700/VqbcmM/2022/6/4/d1ce779e-adaf-4449-bd52-d91f73dcc23c.jpg.webp?ect=4g" />
                            </div>
                            <div>
                                <ProductDetailPicture src="https://images.tokopedia.net/img/cache/500-square/VqbcmM/2022/6/4/ce9acd9b-1453-4d94-9a03-1e47810da655.jpg.webp?ect=4g" />
                            </div>
                            <div>
                                <ProductDetailPicture src="https://images.tokopedia.net/img/cache/700/VqbcmM/2022/6/4/bc460c58-a5c7-4fe1-8dd4-579c476f8097.jpg.webp?ect=4g" />
                            </div>
                            <div>
                                <ProductDetailPicture src="https://images.tokopedia.net/img/cache/100-square/VqbcmM/2022/6/4/bc460c58-a5c7-4fe1-8dd4-579c476f8097.jpg.webp?ect=4g" />
                            </div>*/}
            </Carousel>
          </ProductDetailCarousel>
        </Col>
        <Col className="gutter-row" span={12}>
          <Title level={2}>{productName}</Title>
          <br />
          <Title level={4}>{price}</Title>
          {/*<ItemSizeRadio onClick={(e) => setItemSize("s")}>S</ItemSizeRadio>
                    <ItemSizeRadio onClick={(e) => setItemSize("m")}>M</ItemSizeRadio>
                    <ItemSizeRadio onClick={(e) => setItemSize("l")}>L</ItemSizeRadio>
                    <ItemSizeRadio onClick={(e) => setItemSize("xl")}>XL</ItemSizeRadio>*/}
          <br />
          <br />
          Qty &nbsp; <InputNumber ref={qtyInput} />
          <br />
          <br />
          <Button type="primary" onClick={AddCartHandler}>
            Add to cart
          </Button>
        </Col>
      </Row>
      <ProductDetailBox>
        <Title level={3}>Product Detail</Title>
        <ProductDetailDivider />
        <span>{productDetail}</span>
      </ProductDetailBox>
    </PublicLayout>
  );
}

export default DetailProductPage;
