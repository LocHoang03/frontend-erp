import { NextRouter } from 'next/router';

export const goToWithSearch = (
  router: NextRouter,
  search: string,
  page: number = 1,
  size: number = 10,
) => {
  router.push({
    pathname: router.pathname,
    query: { search, page, size },
  });
};

export const goToWithSearchEmployee = (
  router: NextRouter,
  search: string,
  page: number = 1,
  size: number = 10,
  status: string,
  department: string,
) => {
  router.push({
    pathname: router.pathname,
    query: { search, page, size, status, department },
  });
};

export const goToWithSearchWarehouseTransfer = (
  router: NextRouter,
  search: string,
  page: number = 1,
  size: number = 10,
  status: string,
) => {
  router.push({
    pathname: router.pathname,
    query: { search, page, size, status },
  });
};

export const goToWithSearchProduct = (
  router: NextRouter,
  search: string,
  page: number = 1,
  size: number = 10,
  status: string,
  unit: string,
) => {
  router.push({
    pathname: router.pathname,
    query: { search, page, size, status, unit },
  });
};

export const goToWithSearchPartner = (
  router: NextRouter,
  search: string,
  page: number = 1,
  size: number = 10,
  type: string,
) => {
  router.push({
    pathname: router.pathname,
    query: { search, page, size, type },
  });
};

export const goToWithSearchWarehouseTransaction = (
  router: NextRouter,
  search: string,
  page: number = 1,
  size: number = 10,
  status: string,
) => {
  router.push({
    pathname: router.pathname,
    query: { search, page, size, status },
  });
};

export const goToWithSearchAttendancesSalary = (
  router: NextRouter,
  search: string,
  page: number = 1,
  size: number = 10,
  date: string,
  status: string,
) => {
  router.push({
    pathname: router.pathname,
    query: { search, page, size, date, status },
  });
};

export const goToWithSearchProject = (
  router: NextRouter,
  search: string,
  page: number = 1,
  size: number = 10,
  status: string,
) => {
  router.push({
    pathname: router.pathname,
    query: { search, page, size, status },
  });
};

export const goToWithSearchTask = (
  router: NextRouter,
  search: string,
  page: number = 1,
  size: number = 10,
  status: string,
  priority: string,
) => {
  router.push({
    pathname: router.pathname,
    query: { search, page, size, status, priority },
  });
};
export const goToWithSearchOrder = (
  router: NextRouter,
  search: string,
  page: number = 1,
  size: number = 10,
  status: string,
  type: string,
) => {
  router.push({
    pathname: router.pathname,
    query: { search, page, size, status, type },
  });
};
