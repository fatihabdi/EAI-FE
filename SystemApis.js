import getConfig from 'next/config'

export const EndPoint = getConfig().publicRuntimeConfig.backend_url;

export const HomeCategory = "/categories";

export const Categories = "/categories";
export const ProductsList = "/search/product";
export const ProductsAll = "/search/products";
export const AddProducts = "/products";
export const ProductDetail = "/products/";

export const SignUp = "/register";
export const SignIn = "/login";

export const UserProfile = "/user/profile";
export const UserBalances = "/user/balance";
export const UserTopUp = "/user/balance/topup";