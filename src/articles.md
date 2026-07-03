---
layout: base.njk
permalink: "/articles/"
pageTitle: "מאמרים"
pageDescription: "מאמרים מאת נועה ארנטל — פסיכותרפיסטית ועו\"ס קלינית: על חרדה, טיפול אונליין, ואיך מתחילים טיפול. כתיבה אישית ומקצועית על נפש ותהליכי שינוי."
---
{% set root = page.url | rootPath %}
<section class="page-hero">
  <div class="band-inner narrow">
    <span class="eyebrow" style="justify-content:center">כתיבה</span>
    <h1>מאמרים</h1>
    <p class="page-hero-sub">מחשבות וכתיבה על טיפול, נפש ותהליכי שינוי.</p>
  </div>
</section>

<section class="band">
  <div class="band-inner narrow">
    <div class="articles-list">
      {% for post in collections.articles | reverse %}
      <a class="article-card reveal" href="{{ root }}{{ post.url }}">
        <span class="article-card-date">{{ post.date | readableDate }}</span>
        <h2>{{ post.data.pageTitle }}</h2>
        <p>{{ post.data.pageDescription }}</p>
        <span class="article-card-more">לקריאה ←</span>
      </a>
      {% endfor %}
    </div>
    <p style="margin-top:34px;color:var(--muted)">רוצים לקרוא עוד? אני משתפת תכנים גם ב<a href="{{ business.facebook }}" target="_blank" rel="noopener" style="text-decoration:underline">עמוד הפייסבוק שלי</a>.</p>
  </div>
</section>

<section class="band band-soft cta-band">
  <div class="band-inner narrow">
    <h2>מתאים לכם? בואו נדבר</h2>
    <p>שיחת היכרות ראשונית, ללא התחייבות — נחשוב יחד מה הכי מתאים עבורכם.</p>
    <div class="cta-actions">
      <a href="{{ root }}/contact/" class="btn btn-primary">לתיאום שיחה</a>
      <a href="https://wa.me/{{ business.whatsapp }}?text=%D7%94%D7%99%D7%99%20%D7%A0%D7%95%D7%A2%D7%94%2C%20%D7%94%D7%92%D7%A2%D7%AA%D7%99%20%D7%9E%D7%94%D7%90%D7%AA%D7%A8%20%D7%A9%D7%9C%D7%9A%20%D7%95%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%AA%D7%90%D7%9D%20%D7%A9%D7%99%D7%97%D7%AA%20%D7%94%D7%99%D7%9B%D7%A8%D7%95%D7%AA" class="btn btn-ghost" target="_blank" rel="noopener">WhatsApp</a>
    </div>
  </div>
</section>
