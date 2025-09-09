library(tidyverse) #import the packages 
library(ggfortify)
library(agridat)
library(ggplot2)

install.packages("caret")
install.packages("randomForest")

library(caret)   # for modeling
library(randomForest)

df <- Marine_Microplastics_WGS84_8553846406879449657

df_filtered <- df %>%
  filter(!is.na(Water.Sample.Depth..m.),
         !is.na(Microplastics.measurement),
         Water.Sample.Depth..m. <= 100)

# Select predictors
df_model <- df_filtered %>%
  select(Microplastics.measurement,
         Water.Sample.Depth..m.,
         Latitude..degree.,
         Longitude.degree.,
         Ocean)

# Encode categorical variable
df_model$Ocean <- as.factor(df_model$Ocean)

# Train/test split (80/20)
# Train/test split with base R
set.seed(123)
trainIndex <- sample(1:nrow(df_model), 0.8 * nrow(df_model))
trainData <- df_model[trainIndex, ]
testData  <- df_model[-trainIndex, ]

# Fit linear regression model
lm_model <- lm(Microplastics.measurement ~ ., data = trainData)

# Model summary
summary(lm_model)

# Predict on test set
predictions <- predict(lm_model, newdata = testData)

# Evaluate model
rmse <- sqrt(mean((predictions - testData$Microplastics.measurement)^2))
r2 <- cor(predictions, testData$Microplastics.measurement)^2

cat("Test RMSE:", rmse, "\n")
cat("Test R²:", r2, "\n")

install.packages("cli")
library(cli)
ggplot(df_model, aes(x = Water.Sample.Depth..m., y = Microplastics.measurement)) +
  geom_point(alpha = 0.4, color = "blue") +
  geom_smooth(method = "lm", color = "red", se = TRUE) +
  labs(
    title = "Microplastics Concentration vs Water Sample Depth (≤100m)",
    x = "Water Sample Depth (m)",
    y = "Microplastics Concentration"
  ) +
  theme_minimal()
lm_model <- lm(Microplastics.measurement ~ Water.Sample.Depth..m. +
                 Latitude..degree. + Longitude.degree. + Ocean,
               data = df_model)

# 2. Create prediction column
df_model$Predicted <- predict(lm_model, newdata = df_model)

# 3. Plot predictions by location
ggplot(df_model, aes(x = Longitude.degree., y = Latitude..degree.)) +
  geom_point(aes(color = Predicted), size = 2, alpha = 0.7) +
  scale_color_viridis_c(option = "plasma") +
  labs(
    title = "Predicted Microplastics Concentration by Location",
    x = "Longitude",
    y = "Latitude",
    color = "Predicted\nConcentration"
  ) +
  theme_minimal()
ggplot(df_model, aes(x = Longitude.degree., y = Latitude..degree.)) +
  geom_point(aes(color = Predicted), size = 2, alpha = 0.7) +
  scale_color_viridis_c(option = "plasma") +
  labs(
    title = "Predicted Microplastics Concentration by Location",
    x = "Longitude",
    y = "Latitude",
    color = "Predicted\nConcentration"
  ) +
  theme_minimal()




install.packages("akima")
library(akima)
library(ggplot2)

# Interpolate predictions onto a grid
interp_data <- with(df_model,
                    interp(x = Longitude.degree.,
                           y = Latitude..degree.,
                           z = Predicted,
                           duplicate = "mean",
                           nx = 200, ny = 200)  # resolution of grid
)

# Convert interp output to dataframe
grid_df <- data.frame(
  expand.grid(
    x = interp_data$x,
    y = interp_data$y
  ),
  z = as.vector(interp_data$z)
)

df_model$Predicted <- pmax(0, predict(lm_model, newdata = df_model))

# Plot heatmap
ggplot() +
  geom_raster(data = grid_df, aes(x = x, y = y, fill = z), interpolate = TRUE) +
  scale_fill_viridis_c(option = "plasma", na.value = "white") +
  geom_point(data = df_model, aes(x = Longitude.degree., y = Latitude..degree.), 
             color = "black", size = 0.5, alpha = 0.5) +
  labs(
    title = "Predicted Microplastics Concentration (Heatmap)",
    x = "Longitude",
    y = "Latitude",
    fill = "Concentration"
  ) +
  theme_minimal()



# Define a function for prediction
predict_microplastics <- function(longitude, latitude, depth, ocean) {
  
  # Create new data frame with same structure as model
  new_data <- data.frame(
    Longitude.degree. = longitude,
    Latitude..degree. = latitude,
    Water.Sample.Depth..m. = depth,
    Ocean = factor(ocean, levels = levels(df_model$Ocean))
  )
  
  # Predict using lm_model
  prediction <- predict(lm_model, newdata = new_data)
  
  return(prediction)
}

# Example usage:
predict_microplastics(longitude = -60, latitude = 40, depth = 50, ocean = "Atlantic Ocean")










# Refit model if needed
lm_model <- lm(Microplastics.measurement ~ Water.Sample.Depth..m. +
                 Latitude..degree. + Longitude.degree. + Ocean,
               data = df_model)

# ✅ Clamp predictions so they are never negative
df_model$Predicted <- pmax(0, predict(lm_model, newdata = df_model))

# Interpolate predictions onto a grid
library(akima)
interp_data <- with(df_model,
                    interp(x = Longitude.degree.,
                           y = Latitude..degree.,
                           z = Predicted,
                           duplicate = "mean",
                           nx = 200, ny = 200)  # grid resolution
)

# Convert interp output to dataframe
grid_df <- data.frame(
  expand.grid(
    x = interp_data$x,
    y = interp_data$y
  ),
  z = as.vector(interp_data$z)
)

# Plot heatmap
library(ggplot2)

ggplot() +
  geom_raster(data = grid_df, aes(x = x, y = y, fill = z), interpolate = TRUE) +
  scale_fill_viridis_c(option = "plasma", na.value = "white") +
  geom_point(data = df_model, aes(x = Longitude.degree., y = Latitude..degree.), 
             color = "black", size = 0.5, alpha = 0.5) +
  labs(
    title = "Predicted Microplastics Concentration (Heatmap, Non-Negative)",
    x = "Longitude",
    y = "Latitude",
    fill = "Concentration"
  ) +
  theme_minimal()

 
ggplot() +
  geom_raster(data = grid_df, aes(x = x, y = y, fill = z), interpolate = TRUE) +
  scale_fill_gradientn(
    colours = c("yellow", "purple"),
    values = scales::rescale(c(0, 200)),
    limits = c(0, 200),
    oob = scales::squish
  ) +
  geom_point(data = df_model, aes(x = Longitude.degree., y = Latitude..degree.), 
             color = "black", size = 0.5, alpha = 0.5) +
  labs(
    title = "Predicted Microplastics Concentration (Heatmap)",
    x = "Longitude",
    y = "Latitude",
    fill = "Concentration"
  ) +
  theme_minimal()