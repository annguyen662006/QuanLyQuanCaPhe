
import { User, UserRole, Category, Product } from '../types';
import { supabase } from './supabase';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export const seedUsers = async () => {
    console.log("Supabase connection established with security layer.");
};

export const mockApi = {
  // --- Auth ---
  login: async (identifier: string, password?: string) => {
    const normalizedId = identifier.toLowerCase().trim();
    
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .or(`username.eq.${normalizedId},email.eq.${normalizedId}`)
      .single();

    if (error || !user) throw new Error("Tên đăng nhập hoặc mật khẩu không chính xác");
    
    // So sánh mật khẩu (Compare hash)
    if (password) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Tên đăng nhập hoặc mật khẩu không chính xác");
        }
    }
    
    if (user.status === 'inactive') {
        throw new Error("Tài khoản của bạn đã bị vô hiệu hóa");
    }
    
    const { password: _, ...userWithoutPass } = user;
    return userWithoutPass as User;
  },

  register: async (data: { name: string, email: string, password: string }) => {
    // Băm mật khẩu trước khi lưu
    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

    const newUser = {
        username: data.email.split('@')[0],
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: UserRole.CASHIER,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=random`,
        status: 'active',
        joined_date: new Date().toISOString()
    };

    const { data: createdUser, error } = await supabase
      .from('users')
      .insert([newUser])
      .select()
      .single();

    if (error) throw new Error(error.message || "Đăng ký thất bại");
    
    const { password: _, ...userWithoutPass } = createdUser;
    return userWithoutPass as User;
  },

  updateProfile: async (id: string, data: { name: string, email: string }) => {
    const { data: updatedUser, error } = await supabase
      .from('users')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message || "Cập nhật thất bại");
    
    const { password: _, ...userWithoutPass } = updatedUser;
    return userWithoutPass as User;
  },

  changePassword: async (id: string, currentPass: string, newPass: string) => {
    // Kiểm tra mật khẩu hiện tại
    const { data: user } = await supabase.from('users').select('password').eq('id', id).single();
    if (!user) throw new Error("Không tìm thấy người dùng");

    const isMatch = await bcrypt.compare(currentPass, user.password);
    if (!isMatch) {
        throw new Error("Mật khẩu hiện tại không chính xác");
    }

    // Băm mật khẩu mới
    const hashedNewPassword = await bcrypt.hash(newPass, SALT_ROUNDS);

    const { error } = await supabase
      .from('users')
      .update({ password: hashedNewPassword })
      .eq('id', id);

    if (error) throw new Error("Không thể đổi mật khẩu");
    return true;
  },

  // --- User Management ---
  createUser: async (user: Omit<User, 'id' | 'joinedDate' | 'status' | 'avatar'> & { password?: string }) => {
    const rawPass = user.password || 'password123';
    const hashedPassword = await bcrypt.hash(rawPass, SALT_ROUNDS);

    const newUser: any = {
      ...user,
      username: user.email.split('@')[0],
      status: 'active',
      joined_date: new Date().toISOString(),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`,
      password: hashedPassword
    };

    const { data: created, error } = await supabase
      .from('users')
      .insert([newUser])
      .select()
      .single();

    if (error) throw new Error(error.message);
    const { password: _, ...result } = created;
    return result as User;
  },

  updateUser: async (id: string, data: Partial<User> & { password?: string }) => {
    const updates: any = { ...data };
    
    // Nếu có mật khẩu mới, hãy băm nó
    if (updates.password) {
        updates.password = await bcrypt.hash(updates.password, SALT_ROUNDS);
    } else {
        delete updates.password;
    }

    const { data: updated, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    const { password: _, ...result } = updated;
    return result as User;
  },

  getUsers: async () => {
    const { data: users, error } = await supabase.from('users').select('*').order('name');
    if (error) return [];
    return users.map((u: any) => {
        const { password, ...rest } = u;
        return rest as User;
    });
  },

  // --- Category Management ---
  getCategories: async () => {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('order_index');

    if (error) return [];
    return categories.map(c => ({
        ...c,
        order: c.order_index
    })) as Category[];
  },

  createCategory: async (name: string) => {
    const { data: currentCats } = await supabase.from('categories').select('id');
    const newCategory = {
      name,
      order_index: (currentCats?.length || 0)
    };
    
    const { data, error } = await supabase
      .from('categories')
      .insert([newCategory])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Category;
  },

  updateCategory: async (id: string, name: string) => {
    const { data, error } = await supabase
      .from('categories')
      .update({ name })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Category;
  },

  deleteCategory: async (id: string) => {
    await supabase.from('products').delete().eq('category_id', id);
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return true;
  },

  reorderCategories: async (orderedIds: string[]) => {
    const updates = orderedIds.map((id, index) => 
      supabase.from('categories').update({ order_index: index }).eq('id', id)
    );
    await Promise.all(updates);
    return true;
  },

  // --- Product Management ---
  uploadProductImage: async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    return publicUrl;
  },

  getProducts: async (categoryId?: string) => {
    let query = supabase.from('products').select('*');
    if (categoryId) {
        query = query.eq('category_id', categoryId);
    }
    const { data: products, error } = await query;
    if (error) return [];
    
    return (products as any[]).map(p => ({
        ...p,
        category: p.category_id,
        variantGroups: p.variant_groups
    })) as Product[];
  },

  createProduct: async (product: Omit<Product, 'id'>) => {
    const { category, variantGroups, ...rest } = product as any;
    const dbProduct = {
      ...rest,
      category_id: category,
      variant_groups: variantGroups,
      status: product.status || 'available',
      stock: product.stock || 0
    };

    const { data, error } = await supabase
      .from('products')
      .insert([dbProduct])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Product;
  },

  updateProduct: async (id: string, updates: Partial<Product>) => {
    const { category, variantGroups, ...rest } = updates as any;
    const dbUpdates: any = { ...rest };
    if (category) dbUpdates.category_id = category;
    if (variantGroups) dbUpdates.variant_groups = variantGroups;

    const { data, error } = await supabase
      .from('products')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as Product;
  },

  deleteProduct: async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw new Error(error.message);
    return true;
  }
};
