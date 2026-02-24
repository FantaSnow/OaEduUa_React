import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
} from "@mui/material";
import VolunteeringService from "@/api/services/VolunteeringService";
import VolunteeringCategoryService from "@/api/services/VolunteeringCategoryService";
import { formatDateOnlyEuropean } from "@/utils/date";
import type { VolunteeringEntity } from "@/types/entities";

const volunteerImg = "/assets/images/NoPhoto.jpg";

const VolunteeringDetails: React.FC = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<VolunteeringEntity | null>(null);
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = params?.id ? Number(params.id) : NaN;
    if (!params?.id || Number.isNaN(id)) {
      setLoading(false);
      setData(null);
      setCategoryName(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    setCategoryName(null);
    VolunteeringService.getById(id)
      .then((item) => {
        if (!cancelled) {
          setData(item);
          if (item.volunteeringcategory?.name) {
            setCategoryName(item.volunteeringcategory.name);
          } else if (item.volunteeringcategory_id) {
            VolunteeringCategoryService.getById(item.volunteeringcategory_id)
              .then((cat) => {
                if (!cancelled) setCategoryName(cat.name);
              })
              .catch(() => {});
          }
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Не вдалося завантажити");
          setData(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [params?.id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Box sx={{ p: 6 }}>
        <Typography variant="h2" color="error">
          {error || "Волонтерство не знайдено"}
        </Typography>
        <Button sx={{ mt: 2 }} onClick={() => router.back()}>
          Назад
        </Button>
      </Box>
    );
  }

  const dateStartFormatted = formatDateOnlyEuropean(data.date_start);
  const dateEndFormatted = formatDateOnlyEuropean(data.date_end);
  const dateText =
    [dateStartFormatted, dateEndFormatted].filter(Boolean).join(" — ") || undefined;
  const tags = [categoryName].filter(Boolean) as string[];

  return (
    <Box sx={{ minHeight: "100vh", px: 10 }}>
      <Box
        sx={{
          maxWidth: 1600,
          mx: "auto",
          py: 5,
          px: 4,
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            mb: 2,
          }}
        >
          <Typography variant="h1" color="text.primary">
            {data.name}
          </Typography>
          <Button variant="outlined" onClick={() => router.back()}>
            Назад
          </Button>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 5,
            alignItems: "flex-start",
            width: "100%",
          }}
        >
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              bgcolor: "secondary.secondary10",
              borderRadius: 4,
              p: 4,
              minWidth: 0,
              boxShadow: "0px 4px 5px 2px #00000024",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {dateText && (
              <Typography variant="h4" color="text.primary">
                {dateText}
              </Typography>
            )}
            {data.location && (
              <Typography variant="h4" color="text.primary" sx={{ mb: 2 }}>
                {data.location}
              </Typography>
            )}
            {tags.length > 0 && (
              <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
                {tags.map((tag, idx) => (
                  <Button
                    key={idx}
                    variant="contained"
                    size="small"
                    sx={{
                      bgcolor: "primary.primary20",
                      px: 2,
                      minWidth: 80,
                      width: "auto",
                      boxShadow: "none",
                    }}
                  >
                    {tag}
                  </Button>
                ))}
              </Box>
            )}
            <Typography variant="h2" color="text.primary" sx={{ mt: 2, mb: 1 }}>
              Ставай волонтером
            </Typography>
            {data.desc && (
              <Typography variant="bodyM" color="text.primary" sx={{ mb: 3 }}>
                {data.desc}
              </Typography>
            )}
            {data.goal && (
              <Typography variant="bodyM" color="text.primary">
                <strong>Мета:</strong> {data.goal} волонтерів
              </Typography>
            )}
          </Paper>

          <Paper
            elevation={0}
            sx={{
              minWidth: 520,
              maxWidth: 700,
              width: "40%",
              borderRadius: 4,
              boxShadow: "0px 4px 5px 2px #00000024",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 0,
              overflow: "hidden",
              height: 420,
            }}
          >
            <Box
              component="img"
              src={volunteerImg}
              alt=""
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default VolunteeringDetails;
