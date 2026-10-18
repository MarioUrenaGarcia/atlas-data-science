---
id: codificacion-ordinal
titulo: Codificación ordinal
titulo_en: Ordinal encoding
alias:
  - codificación por enteros
  - label encoding
  - codificación de escalas ordenadas
modulo: 12
submodulo: '12.3'
orden: 8
nivel: basico
prerrequisitos:
  - codificacion-one-hot
  - escalas-nominal-ordinal-de-intervalo-y-de-razon
etiquetas:
  - variables categóricas
  - codificación
  - escala ordinal
  - ingeniería de características
resumen: >
  La codificación ordinal reemplaza cada categoría por un entero según su posición en un orden. Es adecuada
  cuando el orden es real (tallas, niveles de satisfacción) y engañosa cuando las categorías no lo tienen.
formula: 'x = c_{(r)} \mapsto r, \qquad r = 1, \dots, K'
visualizacion:
  componente: FeatureEngineeringViz
  parametros:
    modo: ordinal
    caso: tallas
referencias:
  - clave: agresti
  - clave: james-isl
publicado: true
---

## Intuición

Las tallas de una playera tienen un orden claro: CH, M, G y EG. Escribirlas como 1, 2, 3 y 4 conserva ese orden en una sola columna, mucho más compacta que cuatro columnas de ceros y unos. Un modelo lineal puede entonces aprender que el precio sube un tanto por cada talla, y un árbol puede cortar en "talla mayor que 2" para separar las grandes de las chicas.

La **codificación ordinal** tiene dos condiciones para funcionar bien. La primera es que el orden de los códigos sea el orden real: si se asignan en orden alfabético, EG queda antes que G y CH, y el modelo aprende relaciones absurdas. La segunda es que el modelo, si es lineal, supondrá que los saltos entre categorías consecutivas son iguales: pasar de CH a M "vale" lo mismo que pasar de G a EG. En una escala de satisfacción eso es un supuesto razonable pero no garantizado. Y para categorías sin orden, como colores, cualquier asignación de enteros inventa un orden y unas distancias que no existen.

## Definición

:::definicion[Codificación ordinal]
Sea $x$ una variable con categorías ordenadas $c_{(1)} \prec c_{(2)} \prec \dots \prec c_{(K)}$. La **codificación ordinal** asigna a cada categoría su rango:

$$
x = c_{(r)} \mapsto r, \qquad r = 1, \dots, K.
$$

La diferencia de códigos $|r - s|$ entre dos categorías se interpreta como una distancia; esa interpretación solo es válida si los escalones entre categorías consecutivas son comparables.
:::

:::nota[Qué significa cada símbolo]
- $x$: valor categórico.
- $c_{(r)}$: categoría que ocupa el lugar $r$ en el orden.
- $\prec$: "va antes que" en el orden de la escala.
- $K$: número de categorías.
- $r$, $s$: códigos enteros asignados.
:::

## Cómo usar la visualización

Las categorías se colocan una por una sobre una recta en la posición de su código. El color de cada punto indica su lugar en el orden natural de la escala, de modo que si los colores aparecen revueltos, los códigos no respetan el orden. El selector cambia entre el orden natural y el alfabético; las lecturas indican si el orden es real y la distancia implícita entre la primera y la última categoría.

Experimentos sugeridos: en tallas, cambiar al orden alfabético y ver que EG queda entre CH y G; en colores, notar que no hay ningún orden que respetar.

## Ejemplo

Una encuesta mide satisfacción con cinco niveles: muy insatisfecho, insatisfecho, neutral, satisfecho y muy satisfecho.

1. Códigos en orden natural: 1, 2, 3, 4 y 5.
2. La distancia implícita entre "muy insatisfecho" y "muy satisfecho" es $|1 - 5| = 4$, y entre "neutral" y "satisfecho" es 1.
3. En orden alfabético, los códigos serían: insatisfecho 1, muy insatisfecho 2, muy satisfecho 3, neutral 4, satisfecho 5. "Muy satisfecho" quedaría por debajo de "neutral" y la distancia entre los dos extremos sería 1.
4. Un modelo lineal con el orden natural estima un cambio por cada nivel; con el alfabético, mezcla niveles opuestos.

:::figura[La escala de satisfacción del ejemplo con códigos en orden natural: el color avanza en el mismo sentido que los códigos.]{componente="FeatureEngineeringViz"}
```yaml
modo: ordinal
caso: satisfaccion
orden: natural
```
:::

## Propiedades

- **Usa una sola columna.** Frente a las $K$ columnas de la codificación one-hot, es compacta y conserva el orden.
- **Un modelo lineal impone escalones iguales.** El efecto de pasar de un nivel al siguiente es el mismo coeficiente para todos los pares consecutivos.
- **Los árboles solo usan el orden.** Un árbol corta en umbrales, así que solo importa que el orden sea correcto, no la separación entre códigos.

:::figura[La misma escala de satisfacción con códigos alfabéticos: los colores quedan revueltos porque el orden de los códigos no sigue el de la escala.]{componente="FeatureEngineeringViz"}
```yaml
modo: ordinal
caso: satisfaccion
orden: alfabetico
```
:::

## Errores comunes

- **Usar el orden alfabético o el de aparición.** Las herramientas suelen asignar enteros en orden alfabético; para una escala ordinal, el orden se fija a mano.
- **Codificar con enteros una variable nominal.** Asignar 1 a rojo y 4 a azul hace que un modelo lineal trate al azul como "cuatro veces" algo y al blanco como intermedio entre ambos.
- **Suponer escalones iguales sin pensarlo.** Entre "satisfecho" y "muy satisfecho" puede haber más diferencia real que entre "neutral" y "satisfecho"; si importa, se usa one-hot o una codificación con saltos estimados.

:::figura[Error de codificar con enteros una variable nominal: los colores del auto reciben códigos y la recta sugiere que gris está entre blanco y azul, una relación que no existe.]{componente="FeatureEngineeringViz"}
```yaml
modo: ordinal
caso: colores
```
:::

:::figura[Error del orden alfabético en tallas: EG recibe el código 2 y queda antes que G y M.]{componente="FeatureEngineeringViz"}
```yaml
modo: ordinal
caso: tallas
orden: alfabetico
```
:::

## Conexiones

Se aplica a variables de escala ordinal según [[escalas-nominal-ordinal-de-intervalo-y-de-razon]]; para escalas nominales la alternativa es la [[codificacion-one-hot]]. Los códigos son los rangos de las categorías, como los rangos que usa la [[correlacion-de-spearman]]. La [[discretizacion]] de una variable continua produce precisamente categorías ordinales.

## Formulario

:::formula[Código ordinal]
$$
c_{(r)} \mapsto r
$$

- $c_{(r)}$: categoría en el lugar $r$ del orden.
- $r$: código entero, de $1$ a $K$.
:::

:::formula[Distancia implícita entre categorías]
$$
d\big(c_{(r)}, c_{(s)}\big) = |r - s|
$$

- $r$, $s$: códigos de las dos categorías.
- Solo tiene sentido si los escalones entre categorías consecutivas son comparables.
:::

:::formula[Efecto en un modelo lineal]
$$
\hat{y} = \beta_0 + \beta_1 r
$$

- $\beta_1$: cambio estimado en $y$ por cada nivel de la escala, igual para todos los escalones.
:::
