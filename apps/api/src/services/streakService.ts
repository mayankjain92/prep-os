import { IUser } from "../models/User.js";

export async function recordDailyLogin(user: IUser): Promise<IUser> {
  const todayStr = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
  const loginDates = user.loginDates || [];

  if (user.lastLoginDate === todayStr) {
    return user;
  }

  if (!user.lastLoginDate) {
    user.lastLoginDate = todayStr;
    user.currentStreak = 1;
    user.longestStreak = 1;
    user.loginDates = [todayStr];
    await user.save();
    return user;
  }

  const lastDate = new Date(user.lastLoginDate);
  const currentDate = new Date(todayStr);
  const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    user.currentStreak = (user.currentStreak || 0) + 1;
  } else {
    user.currentStreak = 1;
  }

  user.longestStreak = Math.max(user.longestStreak || 0, user.currentStreak);
  user.lastLoginDate = todayStr;

  if (!loginDates.includes(todayStr)) {
    loginDates.push(todayStr);
    user.loginDates = loginDates;
  }

  await user.save();
  return user;
}