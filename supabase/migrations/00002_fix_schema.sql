-- Add missing columns to products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS "description" TEXT DEFAULT '';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS "comparePrice" DECIMAL(10,2) DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS "images" JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS "categoryId" TEXT DEFAULT '';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS "categorySlug" TEXT DEFAULT '';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS "tags" TEXT[] DEFAULT '{}';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS "rating" DECIMAL(3,1) DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS "reviews" INTEGER DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS "featured" BOOLEAN DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS "inStock" BOOLEAN DEFAULT true;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS "stock" INTEGER DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMPTZ DEFAULT NOW();

-- Add missing columns to categories table
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS "image" TEXT DEFAULT '';
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS "description" TEXT DEFAULT '';
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS "productCount" INTEGER DEFAULT 0;

-- Add missing columns to orders table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS "itemCount" INTEGER DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS "customerName" TEXT DEFAULT '';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS "email" TEXT DEFAULT '';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS "paymentMethod" TEXT DEFAULT '';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS "paymentStatus" TEXT DEFAULT 'pending';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS "shippingAddress" JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS "itemsDetail" JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMPTZ DEFAULT NOW();

-- Re-create RLS policies (drop first to avoid duplicates)
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;
DROP POLICY IF EXISTS "Products are insertable by authenticated users" ON public.products;
DROP POLICY IF EXISTS "Products are updatable by authenticated users" ON public.products;
DROP POLICY IF EXISTS "Products are deletable by authenticated users" ON public.products;

CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Products are insertable by authenticated users" ON public.products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Products are updatable by authenticated users" ON public.products FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Products are deletable by authenticated users" ON public.products FOR DELETE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public.categories;
DROP POLICY IF EXISTS "Categories are insertable by authenticated users" ON public.categories;
DROP POLICY IF EXISTS "Categories are updatable by authenticated users" ON public.categories;
DROP POLICY IF EXISTS "Categories are deletable by authenticated users" ON public.categories;

CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Categories are insertable by authenticated users" ON public.categories FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Categories are updatable by authenticated users" ON public.categories FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Categories are deletable by authenticated users" ON public.categories FOR DELETE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Orders are viewable by everyone" ON public.orders;
DROP POLICY IF EXISTS "Orders are insertable by everyone" ON public.orders;
DROP POLICY IF EXISTS "Orders are updatable by authenticated users" ON public.orders;

CREATE POLICY "Orders are viewable by everyone" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Orders are insertable by everyone" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Orders are updatable by authenticated users" ON public.orders FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are insertable by authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are updatable by authenticated users" ON public.profiles;

CREATE POLICY "Profiles are viewable by authenticated users" ON public.profiles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Profiles are insertable by authenticated users" ON public.profiles FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Profiles are updatable by authenticated users" ON public.profiles FOR UPDATE USING (auth.role() = 'authenticated');
