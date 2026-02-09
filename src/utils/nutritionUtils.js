import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * 1. ฟังก์ชันคำนวณ TDEE (Total Daily Energy Expenditure)
 */
export const calculateTDEE = (gender, weight, height, age, activityLevel) => {
    // สูตร BMR (Mifflin-St Jeor Equation)
    let bmr = (10 * parseFloat(weight)) + (6.25 * parseFloat(height)) - (5 * parseInt(age));
    bmr = gender === 'Male' ? bmr + 5 : bmr - 161;

    // ตัวคูณตามระดับกิจกรรม (Activity Factor)
    const factors = {
        'Sedentary': 1.2,           // นั่งทำงาน ไม่ค่อยออกกำลังกาย
        'Lightly Active': 1.375,    // ออกกำลังกายเบาๆ 1-3 วัน/สัปดาห์
        'Moderately Active': 1.55,  // ออกกำลังกายปานกลาง 3-5 วัน/สัปดาห์
        'Very Active': 1.725        // ออกกำลังกายหนัก 6-7 วัน/สัปดาห์
    };

    return Math.round(bmr * (factors[activityLevel] || 1.2));
};

/**
 * 2. ฟังก์ชันตรวจสอบและรีเซ็ตค่าสถิติรายวันเมื่อขึ้นวันใหม่ (เที่ยงคืน)
 */
export const checkAndResetDailyStats = async (setTotalConsumed, setDailyGoal) => {
    try {
        const lastUpdate = await AsyncStorage.getItem('last_update_date');
        const today = new Date().toLocaleDateString('en-CA'); 

        // ดึงค่า Daily Goal ที่เคยบันทึกไว้ (ถ้าไม่มีให้ใช้ 1200 เป็นค่าเริ่มต้น)
        const savedGoal = await AsyncStorage.getItem('daily_calorie_goal') || '1200';
        if (setDailyGoal) setDailyGoal(parseInt(savedGoal, 10));

        if (lastUpdate !== today) {
            // รีเซ็ตค่าเป็น 0 เมื่อตรวจพบว่าเป็นวันใหม่
            await AsyncStorage.setItem('total_consumed', '0');
            await AsyncStorage.setItem('last_update_date', today);
            
            if (setTotalConsumed) setTotalConsumed(0);
            console.log("System: Daily stats have been reset.");
        } else {
            // หากวันเดิม ดึงค่าที่กินไปแล้วมาแสดง
            const savedValue = await AsyncStorage.getItem('total_consumed') || '0';
            if (setTotalConsumed) setTotalConsumed(parseInt(savedValue, 10));
        }
    } catch (error) {
        console.error("Error in checkAndResetDailyStats:", error);
    }
};

/**
 * 3. ฟังก์ชันบันทึกการกินอาหารเพิ่ม
 */
export const addConsumedCalories = async (kcalToAdd, setTotalConsumed) => {
    try {
        const currentTotal = await AsyncStorage.getItem('total_consumed') || '0';
        const newTotal = parseInt(currentTotal, 10) + kcalToAdd;
        await AsyncStorage.setItem('total_consumed', newTotal.toString());
        if (setTotalConsumed) setTotalConsumed(newTotal);
    } catch (error) {
        console.error("Error adding calories:", error);
    }
};

/**
 * 4. ฟังก์ชันบันทึกเป้าหมายแคลอรีใหม่ (ใช้ในหน้า TDEE Calculator)
 */
export const saveDailyCalorieGoal = async (newGoal) => {
    try {
        await AsyncStorage.setItem('daily_calorie_goal', newGoal.toString());
    } catch (error) {
        console.error("Error saving calorie goal:", error);
    }
};