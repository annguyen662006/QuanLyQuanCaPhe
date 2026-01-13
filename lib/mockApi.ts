
import { User, UserRole, Category, Product } from '../types';

const LATENCY = 600; // Reduced slightly for better dev experience

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to get users from localStorage
const getUsers = (): User[] => {
  const usersStr = localStorage.getItem('users');
  return usersStr ? JSON.parse(usersStr) : [];
};

// Seed default users if localStorage is empty
export const seedUsers = () => {
    if (!localStorage.getItem('users')) {
        const defaultUsers: User[] = [
            { id: '1', username: 'admin', password: 'admin123', name: 'Admin User', email: 'admin@pos.com', role: UserRole.ADMIN, avatar: 'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff', status: 'active', joinedDate: '2023-01-15' },
            { id: '2', username: 'cashier', password: 'cashier123', name: 'Nguyễn Thu Ngân', email: 'cashier@pos.com', role: UserRole.CASHIER, avatar: 'https://ui-avatars.com/api/?name=Thu+Ngan&background=random', status: 'active', joinedDate: '2023-02-20' },
            { id: '3', username: 'kitchen', password: 'kitchen123', name: 'Gordon Ramsay', email: 'kitchen@pos.com', role: UserRole.KITCHEN, avatar: 'https://ui-avatars.com/api/?name=Kitchen&background=random', status: 'active', joinedDate: '2023-03-10' },
        ] as any; 
        localStorage.setItem('users', JSON.stringify(defaultUsers));
    }
}

// Initial seed
seedUsers();

export const mockApi = {
  // --- Auth ---
  login: async (identifier: string, password?: string) => {
    await delay(LATENCY);
    const users = getUsers();
    const normalizedId = identifier.toLowerCase().trim();
    
    const user = users.find((u: any) => 
        (u.username === normalizedId || u.email.toLowerCase() === normalizedId) && 
        (!password || u.password === password)
    );
    
    if (!user) throw new Error("Tên đăng nhập hoặc mật khẩu không chính xác");
    
    if (user.status === 'inactive') {
        throw new Error("Tài khoản của bạn đã bị vô hiệu hóa");
    }
    
    const { password: _, ...userWithoutPass } = user as any;
    return userWithoutPass as User;
  },

  register: async (data: { name: string, email: string, password: string }) => {
    await delay(LATENCY);
    const users = getUsers();
    
    if (users.some(u => u.email.toLowerCase() === data.email.toLowerCase())) {
        throw new Error("Email này đã được sử dụng");
    }
    
    const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        username: data.email.split('@')[0],
        name: data.name,
        email: data.email,
        password: data.password,
        role: UserRole.CASHIER,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=random`,
        status: 'active',
        joinedDate: new Date().toISOString().split('T')[0]
    };
    
    users.push(newUser as any);
    localStorage.setItem('users', JSON.stringify(users));
    
    const { password: _, ...userWithoutPass } = newUser;
    return userWithoutPass as User;
  },

  updateProfile: async (id: string, data: { name: string, email: string }) => {
    await delay(LATENCY);
    const users = getUsers();
    const index = users.findIndex(u => u.id === id);
    
    if (index === -1) throw new Error("Không tìm thấy người dùng");
    
    if (data.email !== users[index].email && users.some(u => u.id !== id && u.email.toLowerCase() === data.email.toLowerCase())) {
        throw new Error("Email này đã được sử dụng bởi tài khoản khác");
    }

    users[index] = { ...users[index], ...data };
    localStorage.setItem('users', JSON.stringify(users));
    
    const { password: _, ...userWithoutPass } = users[index] as any;
    return userWithoutPass as User;
  },

  changePassword: async (id: string, currentPass: string, newPass: string) => {
    await delay(LATENCY);
    const users = getUsers();
    const index = users.findIndex(u => u.id === id);
    
    if (index === -1) throw new Error("Không tìm thấy người dùng");
    
    if ((users[index] as any).password !== currentPass) {
        throw new Error("Mật khẩu hiện tại không chính xác");
    }
    
    (users[index] as any).password = newPass;
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  },

  // --- User Management ---
  createUser: async (user: Omit<User, 'id' | 'joinedDate' | 'status' | 'avatar'> & { password?: string }) => {
    await delay(LATENCY);
    const users = getUsers();
    if (users.some(u => u.email.toLowerCase() === user.email.toLowerCase())) {
      throw new Error("Email đã tồn tại");
    }
    const newUser: any = {
      ...user,
      id: Math.random().toString(36).substr(2, 9),
      username: user.email.split('@')[0],
      status: 'active',
      joinedDate: new Date().toISOString().split('T')[0],
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`,
      password: user.password || 'password123'
    };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    const { password: _, ...result } = newUser;
    return result as User;
  },

  updateUser: async (id: string, data: Partial<User> & { password?: string }) => {
    await delay(LATENCY);
    const users = getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) throw new Error("Không tìm thấy người dùng");

    if (data.email && data.email !== users[index].email) {
       if (users.some(u => u.id !== id && u.email.toLowerCase() === data.email.toLowerCase())) {
          throw new Error("Email đã được sử dụng");
       }
    }

    const updates = { ...data };
    if (!updates.password) delete updates.password;

    const updatedUser = { ...users[index], ...updates };
    users[index] = updatedUser;
    localStorage.setItem('users', JSON.stringify(users));
    
    const { password: _, ...result } = updatedUser as any;
    return result as User;
  },

  getUsers: async () => {
    await delay(LATENCY);
    const users = getUsers();
    return users.map((u: any) => {
        const { password, ...rest } = u;
        return rest as User;
    });
  },

  // --- Category Management ---
  getCategories: async () => {
    await delay(LATENCY); 
    let categories = JSON.parse(localStorage.getItem('categories') || 'null');
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    
    if (!categories) {
       categories = [
         { id: '1', name: 'Cà phê', count: 0, order: 0 },
         { id: '2', name: 'Trà sữa', count: 0, order: 1 },
         { id: '3', name: 'Sinh tố', count: 0, order: 2 },
         { id: '4', name: 'Bánh ngọt', count: 0, order: 3 },
         { id: '5', name: 'Topping', count: 0, order: 4 },
       ];
       localStorage.setItem('categories', JSON.stringify(categories));
    }

    // Recalculate counts
    categories = categories.map((cat: Category) => ({
      ...cat,
      count: products.filter((p: Product) => p.category === cat.id).length
    })).sort((a: Category, b: Category) => (a.order || 0) - (b.order || 0));

    return categories as Category[];
  },

  createCategory: async (name: string) => {
    await delay(LATENCY);
    const categories: Category[] = JSON.parse(localStorage.getItem('categories') || '[]');
    
    const newCategory: Category = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      count: 0,
      order: categories.length
    };
    
    categories.push(newCategory);
    localStorage.setItem('categories', JSON.stringify(categories));
    return newCategory;
  },

  updateCategory: async (id: string, name: string) => {
    await delay(LATENCY);
    const categories: Category[] = JSON.parse(localStorage.getItem('categories') || '[]');
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) throw new Error("Category not found");
    
    categories[index].name = name;
    localStorage.setItem('categories', JSON.stringify(categories));
    return categories[index];
  },

  deleteCategory: async (id: string) => {
    await delay(LATENCY);
    let categories: Category[] = JSON.parse(localStorage.getItem('categories') || '[]');
    categories = categories.filter(c => c.id !== id);
    localStorage.setItem('categories', JSON.stringify(categories));
    
    // Optional: Delete products associated with this category or move them to 'Uncategorized'
    let products: Product[] = JSON.parse(localStorage.getItem('products') || '[]');
    products = products.filter(p => p.category !== id);
    localStorage.setItem('products', JSON.stringify(products));
    
    return true;
  },

  reorderCategories: async (orderedIds: string[]) => {
    await delay(300); // Faster for drag and drop
    const categories: Category[] = JSON.parse(localStorage.getItem('categories') || '[]');
    
    // Update order based on the incoming array index
    const updatedCategories = categories.map(cat => {
      const newIndex = orderedIds.indexOf(cat.id);
      return { ...cat, order: newIndex === -1 ? 999 : newIndex };
    }).sort((a, b) => (a.order || 0) - (b.order || 0));
    
    localStorage.setItem('categories', JSON.stringify(updatedCategories));
    return true;
  },

  // --- Product Management ---
  getProducts: async (categoryId?: string) => {
    await delay(LATENCY);
    let products = JSON.parse(localStorage.getItem('products') || 'null');

    // Seed products if empty
    if (!products) {
        products = [
            // Cà phê (id: 1)
            { id: 'p1', name: 'Cà phê đen đá', price: 25000, category: '1', image: 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=100&h=100&fit=crop', stock: 100, status: 'available', sku: 'CF01' },
            { id: 'p2', name: 'Cà phê sữa đá', price: 29000, category: '1', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=100&h=100&fit=crop', stock: 85, status: 'available', sku: 'CF02' },
            { id: 'p3', name: 'Bạc xỉu', price: 32000, category: '1', image: 'https://images.unsplash.com/photo-1582195655514-6c39a738430a?w=100&h=100&fit=crop', stock: 50, status: 'available', sku: 'CF03' },
            
            // Trà sữa (id: 2)
            { id: 'p5', name: 'Trà sữa truyền thống', price: 35000, category: '2', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=100&h=100&fit=crop', stock: 200, status: 'available', sku: 'TS01' },
        ];
        localStorage.setItem('products', JSON.stringify(products));
    }

    if (categoryId) {
        return (products as Product[]).filter(p => p.category === categoryId);
    }
    return products as Product[];
  },

  createProduct: async (product: Omit<Product, 'id'>) => {
    await delay(LATENCY);
    const products: Product[] = JSON.parse(localStorage.getItem('products') || '[]');
    
    const newProduct: Product = {
      ...product,
      id: Math.random().toString(36).substr(2, 9),
      status: product.status || 'available',
      stock: product.stock || 0
    };
    
    products.push(newProduct);
    localStorage.setItem('products', JSON.stringify(products));
    return newProduct;
  },

  updateProduct: async (id: string, updates: Partial<Product>) => {
    await delay(LATENCY);
    const products: Product[] = JSON.parse(localStorage.getItem('products') || '[]');
    const index = products.findIndex(p => p.id === id);
    
    if (index === -1) throw new Error("Product not found");
    
    products[index] = { ...products[index], ...updates };
    localStorage.setItem('products', JSON.stringify(products));
    return products[index];
  },

  deleteProduct: async (id: string) => {
    await delay(LATENCY);
    let products: Product[] = JSON.parse(localStorage.getItem('products') || '[]');
    products = products.filter(p => p.id !== id);
    localStorage.setItem('products', JSON.stringify(products));
    return true;
  }
};
