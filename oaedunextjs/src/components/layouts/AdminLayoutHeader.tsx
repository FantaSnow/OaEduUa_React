"use client";

import React, { useEffect, useRef, useState } from "react";
import { Box, Button } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";

const categories = [
  { label: "Розклад", path: "SchedulesAdmin" },
  { label: "Новини", path: "NewsAdmin" },
  { label: "Волонтерство", path: "VolunteeringAdmin" },
  { label: "Викладачі", path: "TeacherAdmin" },
  { label: "Предмети", path: "SubjectAdmin" },
  { label: "Спеціальність", path: "SpecialtyAdmin" },
  // { label: "Ролі", path: "RoleAdmin" }, // сховано
  { label: "Кафедри", path: "DepartmentAdmin" },
  { label: "Групи", path: "GroupAdmin" },
  { label: "ТипУроку", path: "ClassTypeAdmin" },
  { label: "УрокДетально", path: "ClassNumberAdmin" },
];

const AdminLayoutHeader: React.FC = () => {
  const [show, setShow] = useState(true);
  const lastScroll = useRef(0);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      if (current <= 0 || current < lastScroll.current) {
        setShow(true);
      } else {
        setShow(false);
      }
      lastScroll.current = current;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Box
      sx={{
        mt: 0.5,
        position: "sticky",
        top: 0,
        zIndex: 1100,
        height: "63px",
        bgcolor: "transparent",
        display: "flex",
        transition: "transform 0.3s, opacity 0.3s",
        transform: show ? "translateY(0)" : "translateY(-100%)",
        opacity: show ? 1 : 0,
        pointerEvents: show ? "auto" : "none",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          bgcolor: "transparent",
        }}
      >
        <Box
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            bgcolor: "primary.primary10",
            borderRadius: "20px",
            px: 3,
            gap: 0,
            "& .active": {
              position: "relative",
              color: "text.primary",
              "&::after": {
                content: '""',
                display: "block",
                position: "absolute",
                left: 6,
                right: 6,
                bottom: 0,
                height: "2px",
                background: "currentColor",
                zIndex: 1,
              },
            },
            "& a": {
              position: "relative",
              textDecoration: "none",
              minWidth: 0,
              px: 2,
              py: 0.5,
              transition: "color 0.2s, background 0.2s",
              "&:hover": {
                color: "text.primary",
                backgroundColor: "primary.primary10",
                "&::after": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  left: 6,
                  right: 6,
                  bottom: 0,
                  height: "2px",
                  zIndex: 1,
                },
              },
              "&:active": {
                color: "text.secondary",
              },
            },
          }}
        >
          {categories.map((cat) => {
            const isActive =
              pathname === `/AdminPanel/${cat.path}` ||
              (pathname === "/AdminPanel" && cat.path === "SchedulesAdmin");
            return (
              <Link key={cat.path} href={`/AdminPanel/${cat.path}`}>
                <Button
                  className={isActive ? "active" : ""}
                  sx={{
                    bgcolor: "transparent",
                    textTransform: "none",
                    fontSize: "1rem",
                    minWidth: 0,
                    width: "auto",
                    padding: 0,
                    "&:hover": {
                      bgcolor: "transparent",
                    },
                  }}
                >
                  {cat.label}
                </Button>
              </Link>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayoutHeader;
