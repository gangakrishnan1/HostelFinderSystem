import { createContext, useContext, useMemo, useState } from "react";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    const stored = localStorage.getItem("hostelhub_wishlist");
    return stored ? JSON.parse(stored) : [];
  });

  const persist = (next) => {
    setWishlist(next);
    localStorage.setItem("hostelhub_wishlist", JSON.stringify(next));
  };

  const toggleWishlist = (hostel) => {
    const exists = wishlist.some((item) => item.id === hostel.id);
    const next = exists
      ? wishlist.filter((item) => item.id !== hostel.id)
      : [{ id: hostel.id, name: hostel.name, location: hostel.location }, ...wishlist];
    persist(next);
  };

  const isWishlisted = (id) => wishlist.some((item) => item.id === id);

  const value = useMemo(
    () => ({ wishlist, toggleWishlist, isWishlisted }),
    [wishlist]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  return useContext(WishlistContext);
}
