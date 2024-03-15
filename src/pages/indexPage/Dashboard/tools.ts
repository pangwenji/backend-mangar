import dayjs, { Dayjs } from 'dayjs';
import { MenuItemType } from 'rc-menu/lib/interface';
import type { RangeValue } from 'rc-picker/lib/interface';

export const DashboardDefaultMonth = new Date().getMonth() + 1; // 当前月 1-12

export function getDashboardMonthDistance(month: number): RangeValue<Dayjs> {
	let day = dayjs().set('M', month - 1);
	// 处理去年月份的年份
	if (lastYearMonthCount > 0 && lastYearMonths.includes(month)) {
		day = day.subtract(1, 'years');
	}
	return [day.startOf('M'), day.endOf('M')];
}

const menuItems = Array(12)
	.fill(1)
	.map((_, index) => {
		const month = index + 1;
		return {
			key: month,
			label: `${month}月`,
		};
	}) as MenuItemType[];

const lastYearMonthCount = 3 - (DashboardDefaultMonth - 1); // 去年月份数量
let lastYearMonths: number[] = []; // 去年月份
// 去年的月份位置移动
if (lastYearMonthCount > 0) {
	Array(3 - (DashboardDefaultMonth - 1))
		.fill(1)
		.forEach((_, index) => {
			const targetMonth = DashboardDefaultMonth + 12 - (3 - index);
			lastYearMonths.push(targetMonth);
			const targetMonthIndex = menuItems.findIndex(
				(item) => item.key === targetMonth
			);
			const targetMonthItem = menuItems[targetMonthIndex];
			menuItems.splice(targetMonthIndex, 1);
			menuItems.splice(index, 0, targetMonthItem);
		});
}

export const MonthMenuItems = menuItems;
