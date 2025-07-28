import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import { fetchRecipeById, fetchRecipeInstructions } from "../../utils/api";

import "./RecipeDetail.css";
import Reviews from "../../components/Reviews/Reviews";

const RecipeDetail = () => {
  const { id } = useParams();

  const [recipe, setRecipe] = useState(null);

  const [instructions, setInstructions] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const fetchRecipeData = async () => {
      try {
        setLoading(true);

        const [recipeData, instructionsData] = await Promise.all([
          fetchRecipeById(id),

          fetchRecipeInstructions(id),
        ]);

        if (recipeData) {
          setRecipe(recipeData);
        } else {
          setError("Recipe not found");
        }

        if (instructionsData && instructionsData.length > 0) {
          const steps = instructionsData[0].steps || [];

          setInstructions(
            steps.map((step, index) => ({ ...step, number: index + 1 }))
          );
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRecipeData();
    }
  }, [id]);

  const getCombinedIngredients = () => {
    if (!recipe?.extendedIngredients) return [];

    const ingredientGroups = new Map();

    recipe.extendedIngredients.forEach((ingredient) => {
      const name = ingredient.name;

      const unit = ingredient.measures.metric.unitShort || "";

      if (!ingredientGroups.has(name)) {
        ingredientGroups.set(name, new Map());
      }

      const unitMap = ingredientGroups.get(name);

      if (unitMap.has(unit)) {
        const existing = unitMap.get(unit);

        existing.measures.metric.amount += ingredient.measures.metric.amount;
      } else {
        unitMap.set(unit, {
          ...ingredient,

          measures: {
            metric: { ...ingredient.measures.metric },

            us: ingredient.measures.us
              ? { ...ingredient.measures.us }
              : undefined,
          },
        });
      }
    });

    const result = [];

    ingredientGroups.forEach((unitMap) => {
      unitMap.forEach((ingredient) => {
        result.push(ingredient);
      });
    });

    return result;
  };

  const getNutritionValue = (nutrientName) => {
    if (!recipe?.nutrition?.nutrients) return "N/A";

    const nutrient = recipe.nutrition.nutrients.find(
      (n) => n.name === nutrientName
    );

    return nutrient ? `${Math.round(nutrient.amount)}${nutrient.unit}` : "N/A";
  };

  const nextStep = () => {
    if (currentStep < instructions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getVisibleSteps = () => {
    if (instructions.length === 0) return [];

    const steps = [];

    const totalSteps = instructions.length;

    if (totalSteps === 1) {
      steps.push({ step: instructions[0], index: 0, position: "center" });
    } else if (totalSteps === 2) {
      steps.push({
        step: instructions[0],

        index: 0,

        position: currentStep === 0 ? "center" : "left",
      });

      steps.push({
        step: instructions[1],

        index: 1,

        position: currentStep === 1 ? "center" : "right",
      });
    } else {
      if (currentStep === 0) {
        steps.push({ step: instructions[0], index: 0, position: "center" });

        steps.push({ step: instructions[1], index: 1, position: "right" });

        steps.push({
          step: instructions[totalSteps - 1],
          index: totalSteps - 1,
          position: "left",
        });
      } else if (currentStep === totalSteps - 1) {
        steps.push({
          step: instructions[currentStep - 1],

          index: currentStep - 1,

          position: "left",
        });

        steps.push({
          step: instructions[currentStep],

          index: currentStep,

          position: "center",
        });

        steps.push({
          step: instructions[0],

          index: 0,

          position: "right",
        });
      } else {
        steps.push({
          step: instructions[currentStep - 1],

          index: currentStep - 1,

          position: "left",
        });

        steps.push({
          step: instructions[currentStep],

          index: currentStep,

          position: "center",
        });

        steps.push({
          step: instructions[currentStep + 1],

          index: currentStep + 1,

          position: "right",
        });
      }
    }

    return steps;
  };

  if (loading) {
    return (
      <div className="vintage-recipe-loading">
        <div className="vintage-loading-ornament">❦</div>

        <div className="vintage-loading-spinner"></div>

        <p className="vintage-loading-text">Preparing your recipe...</p>

        <div className="vintage-loading-ornament">❦</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="vintage-recipe-error">
        <div className="vintage-error-frame">
          <h2 className="vintage-error-title">Recipe Unavailable</h2>

          <p className="vintage-error-message">{error}</p>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="vintage-recipe-error">
        <div className="vintage-error-frame">
          <h2 className="vintage-error-title">Recipe Not Found</h2>

          <p className="vintage-error-message">
            This treasured recipe seems to have been misplaced.
          </p>
        </div>
      </div>
    );
  }

  const combinedIngredients = getCombinedIngredients();

  const visibleSteps = getVisibleSteps();

  return (
    <div className="vintage-recipe-detail-container">
      <div className="vintage-paper-texture"></div>

      <section className="vintage-recipe-hero">
        <div className="vintage-hero-content">
          <div className="vintage-hero-image">
            <div className="vintage-image-frame">
              <div className="vintage-frame-corner vintage-corner-tl"></div>

              <div className="vintage-frame-corner vintage-corner-tr"></div>

              <div className="vintage-frame-corner vintage-corner-bl"></div>

              <div className="vintage-frame-corner vintage-corner-br"></div>

              <img
                src={recipe.image || "/placeholder.jpg"}
                alt={recipe.title}
                className="vintage-recipe-image"
                onError={(e) => {
                  e.target.src = "/placeholder.jpg";
                }}
              />

              <div className="vintage-image-vignette"></div>
            </div>

            <div className="vintage-image-caption">A Culinary Masterpiece</div>
          </div>

          <div className="vintage-hero-text">
            <h1 className="vintage-recipe-title">{recipe.title}</h1>

            <div className="vintage-title-underline">
              <div className="vintage-underline-center"></div>
            </div>

            <div
              className="vintage-recipe-summary"
              dangerouslySetInnerHTML={{
                __html: recipe.summary?.replace(/<[^>]*>/g, ""),
              }}
            ></div>

            <div className="vintage-recipe-meta">
              <div className="vintage-meta-item">
                <span className="vintage-meta-label">Cuisine Master</span>

                <span className="vintage-meta-value">
                  {recipe.sourceName || "Traditional Chef"}
                </span>
              </div>

              <div className="vintage-meta-item">
                <span className="vintage-meta-label">Preparation Time</span>

                <span className="vintage-meta-value">
                  {recipe.preparationMinutes || "As needed"} minutes
                </span>
              </div>

              <div className="vintage-meta-item">
                <span className="vintage-meta-label">Cooking Time</span>

                <span className="vintage-meta-value">
                  {recipe.cookingMinutes || recipe.readyInMinutes} minutes
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="modern-nutrition-section">
        <div className="modern-nutrition-container">
          <div className="modern-nutrition-content">
            <div className="modern-nutrition-left">
              <h2 className="modern-nutrition-title">Nutrition facts.</h2>

              <div className="modern-nutrition-facts">
                <div className="modern-nutrition-item">
                  <span className="modern-nutrition-label">Calories:</span>

                  <span className="modern-nutrition-value">
                    {getNutritionValue("Calories")}
                  </span>
                </div>

                <div className="modern-nutrition-item">
                  <span className="modern-nutrition-label">Protein:</span>

                  <span className="modern-nutrition-value">
                    {getNutritionValue("Protein")}
                  </span>
                </div>

                <div className="modern-nutrition-item">
                  <span className="modern-nutrition-label">Carbs:</span>

                  <span className="modern-nutrition-value">
                    {getNutritionValue("Carbohydrates")}
                  </span>
                </div>

                <div className="modern-nutrition-item">
                  <span className="modern-nutrition-label">Sugar:</span>

                  <span className="modern-nutrition-value">
                    {getNutritionValue("Sugar")}
                  </span>
                </div>

                <div className="modern-nutrition-item">
                  <span className="modern-nutrition-label">Fiber:</span>

                  <span className="modern-nutrition-value">
                    {getNutritionValue("Fiber")}
                  </span>
                </div>

                <div className="modern-nutrition-item">
                  <span className="modern-nutrition-label">Fat:</span>

                  <span className="modern-nutrition-value">
                    {getNutritionValue("Fat")}
                  </span>
                </div>
              </div>
            </div>

            <div className="modern-nutrition-right">
              <div className="modern-nutrition-image-container">
                <img
                  src={recipe.image || "/placeholder.jpg"}
                  alt={recipe.title}
                  className="modern-nutrition-image"
                  onError={(e) => {
                    e.target.src = "/placeholder.jpg";
                  }}
                />
              </div>
            </div>
          </div>

          <div className="modern-yellow-blob"></div>
        </div>
      </section>

      <section className="vintage-ingredients-section">
        <div className="vintage-section-header">
          <h2 className="vintage-section-title">Required Ingredients</h2>
        </div>

        <div className="vintage-servings-info">
          <span className="vintage-servings-label">Recipe Yields:</span>

          <span className="vintage-servings-value">
            {recipe.servings} Generous Servings
          </span>
        </div>

        <div className="vintage-ingredients-grid">
          {combinedIngredients.map((ingredient) => (
            <div key={ingredient.id} className="vintage-ingredient-card">
              <div className="vintage-ingredient-frame">
                <div className="vintage-ingredient-image">
                  <img
                    src={`https://spoonacular.com/cdn/ingredients_100x100/${ingredient.image}`}
                    alt={ingredient.name}
                    onError={(e) => {
                      e.target.src = "/placeholder.jpg";
                    }}
                  />

                  <div className="vintage-ingredient-border"></div>
                </div>

                <div className="vintage-ingredient-info">
                  <h3 className="vintage-ingredient-name">{ingredient.name}</h3>

                  <p className="vintage-ingredient-amount">
                    {ingredient.measures.metric.amount}{" "}
                    {ingredient.measures.metric.unitShort}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {instructions.length > 0 && (
        <section className="retro-instructions-section">
          <div className="retro-section-header">
            <h2 className="retro-section-title">Cooking Instructions</h2>

            <div className="retro-step-counter">
              Step {currentStep + 1} of {instructions.length}
            </div>
          </div>

          <div className="retro-instruction-carousel">
            <button
              className="retro-side-nav-btn retro-side-nav-left"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              <span className="retro-side-nav-arrow">‹</span>
            </button>

            <div className="retro-carousel-container">
              <div className="retro-carousel-track">
                {visibleSteps.map(({ step, index, position }) => (
                  <div
                    key={index}
                    className={`retro-instruction-card ${position}`}
                  >
                    <div className="retro-card-quote">"</div>

                    <div className="retro-step-number">{step.number}</div>

                    <div className="retro-step-content">
                      <p className="retro-step-text">
                        {step.step.length > 120
                          ? `${step.step.substring(0, 120)}...`
                          : step.step}
                      </p>

                      {step.equipment?.length > 0 && (
                        <div className="retro-step-equipment">
                          <h4 className="retro-equipment-title">Equipment:</h4>

                          <div className="retro-equipment-tags">
                            {step.equipment.slice(0, 3).map((eq, eqIndex) => (
                              <span
                                key={eqIndex}
                                className="retro-equipment-tag"
                              >
                                {eq.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {step.ingredients?.length > 0 && (
                        <div className="retro-step-ingredients">
                          <h4 className="retro-ingredients-title">
                            Key Ingredients:
                          </h4>

                          <div className="retro-ingredient-tags">
                            {step.ingredients
                              .slice(0, 3)
                              .map((ing, ingIndex) => (
                                <span
                                  key={ingIndex}
                                  className="retro-ingredient-tag"
                                >
                                  {ing.name}
                                </span>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="retro-card-quote retro-card-quote-bottom">
                      "
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              className="retro-side-nav-btn retro-side-nav-right"
              onClick={nextStep}
              disabled={currentStep === instructions.length - 1}
            >
              <span className="retro-side-nav-arrow">›</span>
            </button>

            <div className="retro-step-indicators">
              {instructions.map((_, index) => (
                <button
                  key={index}
                  className={`retro-step-dot ${
                    index === currentStep ? "active" : ""
                  }`}
                  onClick={() => setCurrentStep(index)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <Reviews recipeId={id} />

      <footer className="vintage-recipe-footer">
        <p className="vintage-footer-text">
          May this recipe bring warmth and joy to your table
        </p>

        {recipe.sourceName && (
          <p className="vintage-footer-source">
            From the kitchen of {recipe.sourceName}
          </p>
        )}

        <div className="vintage-footer-decoration">※ ※ ※</div>
      </footer>
    </div>
  );
};

export default RecipeDetail;
