const MOCK_RESPONSE_DELAY = 900;

const wait = (duration) =>
  new Promise((resolve) => {
    setTimeout(resolve, duration);
  });

const getMockResponse = ({ content, vehicleName, mileage }) => {
  const normalizedMessage = content.toLowerCase();
  const displayVehicleName = vehicleName || "הרכב הפעיל";

  if (
    normalizedMessage.includes("נורה") ||
    normalizedMessage.includes("אזהרה")
  ) {
    return `כדי להבין טוב יותר מה הופיע ב־${displayVehicleName}, כדאי לציין את צבע הנורה, הסמל המדויק ומתי היא נדלקה. כרגע זו הדגמה ואין לי חיבור לנתוני אבחון או לספר הרכב, לכן במקרה של ספק חשוב להיעזר באיש מקצוע.`;
  }

  if (
    normalizedMessage.includes("טיפול") ||
    normalizedMessage.includes("תחזוקה")
  ) {
    return `אפשר להתחיל מתאריך הטיפול האחרון, הקילומטראז׳ שבו בוצע ומה הוחלף. בהמשך אוכל להשתמש במידע של ${displayVehicleName} ובספר הרכב כדי להציג הקשר מדויק יותר; כרגע התשובה היא חלק מהדגמת הצ׳אט בלבד.`;
  }

  if (
    normalizedMessage.includes("קילומטראז") ||
    normalizedMessage.includes("ק״מ") ||
    normalizedMessage.includes("קמ")
  ) {
    const numericMileage = Number(mileage);
    const mileageText = Number.isFinite(numericMileage)
      ? `${numericMileage.toLocaleString("he-IL")} ק״מ`
      : "הקילומטראז׳ השמור";

    return `אני רואה שבהקשר של השיחה מופיע ${mileageText}. בגרסה עתידית אוכל להשוות אותו להיסטוריית הטיפולים ולהנחיות היצרן; בשלב הזה אני רק מציג את חוויית השיחה ולא מבצע ניתוח תחזוקה אמיתי.`;
  }

  return `קיבלתי את השאלה לגבי ${displayVehicleName}. זהו מענה הדגמה, אבל מבנה השיחה כבר מוכן להמשך שאלות. בהמשך אחבר את התשובות לנתוני הרכב ולמקורות אמינים כדי לספק הקשר שימושי יותר.`;
};

export const createMockAIService = ({ vehicleName, mileage } = {}) => ({
  async sendMessage({ message }) {
    await wait(MOCK_RESPONSE_DELAY);

    return {
      content: getMockResponse({
        content: message.content,
        vehicleName,
        mileage,
      }),
    };
  },
});
