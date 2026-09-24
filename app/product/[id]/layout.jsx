
import Product from "@/models/product";
import connectDB from "@/config/db";

export async function generateMetadata({ params }) {
    try {
        await connectDB();

        const { id } = await params;

        const product = await Product.findById(id).lean();

        if (!product) {
            return {
                title: "Product Not Found",
                description: "This product could not be found.",
            };
        }

        return {
            title: product.name,
            description: product.description,

            openGraph: {
                title: product.name,
                description: product.description,
                url: `/product/${product._id}`,
                type: "website",

                images: product.image?.length
                    ? [
                          {
                              url: product.image[0],
                              width: 1200,
                              height: 630,
                              alt: product.name,
                          },
                      ]
                    : [],
            },
        };
    } catch (error) {
        console.error("Metadata error:", error);

        return {
            title: "Jersey Store",
            description: "Shop football jerseys online.",
        };
    }
}

export default function ProductLayout({ children }) {
    return children;
}