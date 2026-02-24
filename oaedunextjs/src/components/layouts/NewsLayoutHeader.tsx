"use client";

import React, { useEffect, useRef, useState } from "react";
import { Box, Button } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NewsCategoryService from "@/api/services/NewsCategoryService";
import type { NewsCategory } from "@/types/entities";
import { unwrapApiResponse } from "@/types/api.types";

const NewsLayoutHeader: React.FC = () => {
  const [show, setShow] = useState(true);
  const lastScroll = useRef(0);
  const pathname = usePathname();
  const [categories, setCategories] = useState<NewsCategory[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const resp = await NewsCategoryService.getAll(0, 50);
        setCategories(unwrapApiResponse(resp) ?? []);
      } catch {
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

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
            justifyContent: "center",
            bgcolor: "primary.primary10",
            borderRadius: "20px",
            px: { xs: 1.5, sm: 3 },
            py: 0.5,
            gap: 1,
            flexWrap: "wrap",
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
                whiteSpace: "nowrap",
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
          {/* Загальні (усі новини) */}
          <Link href="/news">
            <Button
              className={pathname === "/news" ? "active" : ""}
              sx={{
                bgcolor: "transparent",
                textTransform: "none",
                fontSize: "1rem",
                minWidth: 0,
                padding: 0,
                "&:hover": {
                  bgcolor: "transparent",
                },
              }}
            >
              Загальні
            </Button>
          </Link>

          {/* Динамічні категорії з бекенду */}
          {categories.map((cat) => {
            const href = `/news/${encodeURIComponent(cat.name)}`;
            const isActive = pathname === href;
            return (
              <Link key={cat.id} href={href}>
                <Button
                  className={isActive ? "active" : ""}
                  sx={{
                    bgcolor: "transparent",
                    textTransform: "none",
                    fontSize: "1rem",
                    minWidth: 0,
                    padding: 0,
                    "&:hover": {
                      bgcolor: "transparent",
                    },
                  }}
                >
                  {cat.name}
                </Button>
              </Link>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default NewsLayoutHeader;
