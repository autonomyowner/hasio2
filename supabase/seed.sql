-- ============================================
-- HASIO SEED DATA
-- Run this after schema.sql to populate data
-- ============================================

-- ============================================
-- LODGING DATA
-- ============================================
INSERT INTO public.lodging (name, name_ar, type, city, city_ar, neighborhood, neighborhood_ar, price_range, rating, images, amenities, amenities_ar, description, description_ar)
VALUES
  (
    'Al-Ahsa InterContinental',
    'فندق انتركونتيننتال الأحساء',
    'hotel',
    'Al-Hofuf',
    'الهفوف',
    'Al-Ahsa',
    'الأحساء',
    '450-650 SAR',
    4.7,
    ARRAY['https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/lodging/intercontinental-aea218dd.webp'],
    ARRAY['Wi-Fi', 'Pool', 'Spa', 'Date Palm Gardens', 'Traditional Dining', 'Prayer Room'],
    ARRAY['واي فاي', 'مسبح', 'سبا', 'حدائق النخيل', 'مطعم تراثي', 'مصلى'],
    'Luxury hotel in the heart of Al-Ahsa Oasis with views of ancient date palm groves and traditional architecture.',
    'فندق فاخر في قلب واحة الأحساء مع إطلالات على بساتين النخيل القديمة والعمارة التراثية.'
  ),
  (
    'Kayan Al Bustan Apartments',
    'شقق كيان البستان',
    'apartment',
    'Al-Hofuf',
    'الهفوف',
    'Al-Ahsa',
    'الأحساء',
    '300-450 SAR',
    4.8,
    ARRAY['https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/lodging/kayan-apartments-f7de2915.jpg'],
    ARRAY['Wi-Fi', 'Traditional Kitchen', 'Parking', 'Mountain Views', 'Prayer Room', 'Date Garden Access'],
    ARRAY['واي فاي', 'مطبخ تراثي', 'موقف سيارات', 'إطلالة الجبل', 'مصلى', 'حديقة النخيل'],
    'Authentic Al-Ahsa apartment near Jabal Al-Qara caves with traditional Hasawi architecture and oasis views.',
    'شقة أصيلة في الأحساء بالقرب من كهوف جبل القارة مع العمارة الحساوية التراثية وإطلالات الواحة.'
  ),
  (
    'Al-Ahsa Desert Camp',
    'مخيم صحراء الأحساء',
    'camp',
    'Eastern Desert',
    'الصحراء الشرقية',
    'Al-Ahsa',
    'الأحساء',
    '800-1200 SAR',
    4.9,
    ARRAY['https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/lodging/desert-camp-a2dc07bf.jpg'],
    ARRAY['Traditional Meals', 'Camel Rides', 'Falconry', 'Stargazing', 'Bedouin Stories', 'Date Harvesting'],
    ARRAY['وجبات تراثية', 'ركوب الجمال', 'الصقارة', 'مراقبة النجوم', 'قصص بدوية', 'جني التمور'],
    'Authentic desert experience on the edge of Al-Ahsa Oasis with traditional Bedouin hospitality and date palm excursions.',
    'تجربة صحراوية أصيلة على حافة واحة الأحساء مع الضيافة البدوية التراثية ورحلات بساتين النخيل.'
  ),
  (
    'Lily Palms Hotel',
    'فندق ليلي بالمز',
    'hotel',
    'Al-Hofuf Center',
    'وسط الهفوف',
    'Al-Ahsa',
    'الأحساء',
    '350-500 SAR',
    4.5,
    ARRAY['https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/lodging/lily-palms-0c1226df.webp'],
    ARRAY['Wi-Fi', 'Oasis Views', 'Pool', 'Traditional Restaurant', 'Prayer Room', 'Spa'],
    ARRAY['واي فاي', 'إطلالة الواحة', 'مسبح', 'مطعم تراثي', 'مصلى', 'سبا'],
    'Central hotel in Al-Hofuf with easy access to traditional souks and UNESCO World Heritage sites.',
    'فندق مركزي في الهفوف مع سهولة الوصول إلى الأسواق التراثية ومواقع التراث العالمي لليونسكو.'
  ),
  (
    'Homestay Experience',
    'تجربة الاستضافة الشعبية',
    'homestay',
    'Old Al-Hofuf',
    'الهفوف القديمة',
    'Al-Ahsa',
    'الأحساء',
    '250-350 SAR',
    4.9,
    ARRAY['https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/lodging/homestay-1-069492f0.jpg'],
    ARRAY['Traditional Breakfast', 'Arabic Coffee', 'Cultural Stories', 'Date Farm Tour', 'Traditional Cooking Class', 'Prayer Room'],
    ARRAY['فطور تراثي', 'قهوة عربية', 'قصص ثقافية', 'جولة مزرعة التمور', 'دروس الطبخ التراثي', 'مصلى'],
    'Experience authentic Hasawi hospitality in a traditional family home with home-cooked meals and cultural experiences.',
    'اختبر الضيافة الحساوية الأصيلة في بيت عائلي تقليدي مع وجبات منزلية وتجارب ثقافية.'
  );

-- ============================================
-- FOOD DATA
-- ============================================
INSERT INTO public.food (name, name_ar, category, cuisine, cuisine_ar, avg_price, hours, images, description, description_ar, rating)
VALUES
  (
    'Al-Ahsa Traditional Restaurant',
    'مطعم الأحساء التراثي',
    'restaurant',
    'Hasawi Traditional',
    'حساوي تراثي',
    '80-150 SAR',
    '12:00 PM - 11:00 PM',
    ARRAY['https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/food/traditional-restaurant-7f7a7b7f.webp'],
    'Authentic Hasawi cuisine featuring date-stuffed lamb, traditional rice dishes, and fresh seafood from Al-Uqair.',
    'مأكولات حساوية أصيلة تتميز بالخروف المحشو بالتمر وأطباق الأرز التراثية والمأكولات البحرية الطازجة من العقير.',
    4.8
  ),
  (
    'Sultanah Kitchen',
    'مطبخ سلطانة',
    'home_kitchen',
    'Home-style Hasawi',
    'حساوي منزلي',
    '40-80 SAR',
    '5:00 PM - 10:00 PM',
    ARRAY['https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/food/sultanah-kitchen-78cc88d7.jpg'],
    'Traditional Hasawi dishes prepared by local productive families, featuring date-based sweets and oasis vegetables.',
    'أطباق حساوية تراثية محضرة من قبل الأسر المنتجة المحلية، تتميز بالحلويات المعتمدة على التمر وخضروات الواحة.',
    4.9
  ),
  (
    'Al-Hofuf Dates & Sweets',
    'تمور وحلويات الهفوف',
    'fastfood',
    'Traditional Sweets',
    'حلويات تراثية',
    '20-45 SAR',
    '8:00 AM - 11:00 PM',
    ARRAY['https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/food/dates-sweets-83cdc6f1.jpg'],
    'Famous for Al-Ahsa dates, traditional sweets, and quick Hasawi snacks in the heart of Al-Hofuf.',
    'مشهور بتمور الأحساء والحلويات التراثية والوجبات الحساوية السريعة في قلب الهفوف.',
    4.7
  ),
  (
    'Qahwat Al-Ahsa',
    'قهوة الأحساء',
    'drinks',
    'Traditional Beverages',
    'مشروبات تراثية',
    '15-35 SAR',
    '5:00 AM - 12:00 AM',
    ARRAY['https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/food/qahwat-alahsa-35297790.jpg'],
    'Traditional Al-Ahsa coffee house serving qahwa with fresh dates, karak tea, and local hospitality.',
    'مقهى تراثي في الأحساء يقدم القهوة مع التمر الطازج وشاي الكرك والضيافة المحلية.',
    4.6
  ),
  (
    'Al-Uqair Seafood House',
    'بيت العقير للمأكولات البحرية',
    'restaurant',
    'Fresh Seafood',
    'مأكولات بحرية طازجة',
    '100-180 SAR',
    '12:00 PM - 11:00 PM',
    ARRAY['https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/food/uqair-seafood-d2798dbc.jpg'],
    'Fresh Arabian Gulf seafood from Al-Uqair port, featuring grilled hammour, shrimp, and traditional fish curry.',
    'مأكولات بحرية طازجة من الخليج العربي من ميناء العقير، تتميز بالهامور المشوي والروبيان وكاري السمك التراثي.',
    4.7
  );

-- ============================================
-- EVENTS DATA
-- ============================================
INSERT INTO public.events (title, title_ar, category, date, time, location, location_ar, images, description, description_ar)
VALUES
  (
    'Al-Ahsa Date Festival',
    'مهرجان تمور الأحساء',
    'festival',
    '2025-10-15',
    '4:00 PM - 11:00 PM',
    'Al-Hofuf Date Palm Groves',
    'بساتين نخيل الهفوف',
    ARRAY['https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/events/date-festival-0ae96b03.jpg'],
    'Annual celebration of Al-Ahsa''s world-famous dates with tastings, traditional crafts, and cultural performances.',
    'احتفال سنوي بتمور الأحساء المشهورة عالمياً مع التذوق والحرف التراثية والعروض الثقافية.'
  ),
  (
    'UNESCO Oasis Heritage Conference',
    'مؤتمر تراث واحة اليونسكو',
    'conference',
    '2025-11-20',
    '9:00 AM - 6:00 PM',
    'Al-Ahsa Cultural Center',
    'مركز الأحساء الثقافي',
    ARRAY['https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/events/unesco-conference-3f1eea82.jpg'],
    'International conference on oasis conservation and sustainable agriculture in UNESCO World Heritage sites.',
    'مؤتمر دولي حول حفظ الواحات والزراعة المستدامة في مواقع التراث العالمي لليونسكو.'
  ),
  (
    'Jabal Al-Qara Cave Exploration',
    'استكشاف كهوف جبل القارة',
    'outdoor',
    '2025-10-25',
    '8:00 AM - 5:00 PM',
    'Jabal Al-Qara Mountain',
    'جبل القارة',
    ARRAY['https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/events/qara-caves-5a0f9843.jpg'],
    'Guided exploration of the famous Al-Qara caves with geological tours and traditional storytelling.',
    'استكشاف موجه لكهوف القارة الشهيرة مع جولات جيولوجية وحكايات تراثية.'
  ),
  (
    'Al-Ahsa Heritage Exhibition',
    'معرض تراث الأحساء',
    'indoor',
    '2025-11-10',
    '10:00 AM - 9:00 PM',
    'Ibrahim Palace Museum',
    'متحف قصر إبراهيم',
    ARRAY['https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/events/heritage-exhibition-4cab5a1c.jpg'],
    'Discover Al-Ahsa''s rich history through artifacts, traditional crafts, and interactive displays at the historic palace.',
    'اكتشف تاريخ الأحساء الغني من خلال القطع الأثرية والحرف التراثية والعروض التفاعلية في القصر التاريخي.'
  ),
  (
    'Al-Ahsa Traditional Crafts Fair',
    'معرض الحرف التراثية',
    'seasonal',
    '2025-12-15',
    '3:00 PM - 10:00 PM',
    'Al-Hofuf Traditional Souq',
    'سوق الهفوف التراثي',
    ARRAY['https://pub-d7fc967a0d9e4e42bba0d712e4f9b96e.r2.dev/events/crafts-fair-ed9a6bc9.jpg'],
    'Traditional Hasawi crafts fair featuring pottery, weaving, date products, and local artisan demonstrations.',
    'معرض الحرف الحساوية التراثية يتميز بالفخار والنسيج ومنتجات التمر وعروض الحرفيين المحليين.'
  );
