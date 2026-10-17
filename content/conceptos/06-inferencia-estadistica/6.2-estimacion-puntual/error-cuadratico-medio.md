---
id: error-cuadratico-medio
titulo: Error cuadrático medio
titulo_en: Mean squared error
alias:
  - ECM
  - MSE
modulo: 6
submodulo: '6.2'
orden: 4
nivel: intermedio
prerrequisitos:
  - sesgo-de-un-estimador
  - varianza-de-un-estimador
etiquetas:
  - inferencia
  - error cuadrático medio
  - comparación de estimadores
  - pérdida cuadrática
resumen: >
  El error cuadrático medio de un estimador es el promedio del cuadrado de la distancia entre la estimación
  y el valor verdadero. Combina sesgo y varianza en una sola medida para comparar estimadores.
formula: '\operatorname{ECM}(\hat{\theta}) = \mathbb{E}_\theta\big[(\hat{\theta} - \theta)^2\big]'
visualizacion:
  componente: EstimatorLab
  parametros:
    modo: diana
    sesgo: 0.6
    dispersion: 0.5
referencias:
  - clave: casella-berger
    capitulo: '7'
  - clave: wasserman
    capitulo: '6'
publicado: true
---

## Intuición

En un tiro al blanco, cada disparo cae a cierta distancia del centro. Un buen tirador es el que, en promedio, deja sus disparos cerca del centro. Si se eleva al cuadrado la distancia de cada disparo y se promedia, se obtiene un número que castiga con fuerza los disparos muy alejados: el **error cuadrático medio**.

Aplicado a un estimador, el centro es el valor verdadero del parámetro y cada disparo es la estimación de una muestra. El error cuadrático medio responde la pregunta práctica: si se usa esta receta una y otra vez, ¿qué tan lejos del valor verdadero queda, en promedio, al cuadrado? Un tirador puede fallar porque apunta mal (sesgo) o porque le tiembla el pulso (varianza); el error cuadrático medio cuenta las dos cosas a la vez.

## Definición

:::definicion[Error cuadrático medio]
El **error cuadrático medio** del estimador $\hat{\theta}$ es
$$
\operatorname{ECM}(\hat{\theta}) = \mathbb{E}_\theta\big[(\hat{\theta} - \theta)^2\big],
$$
el valor esperado de la pérdida cuadrática $(\hat{\theta} - \theta)^2$. Se cumple
$$
\operatorname{ECM}(\hat{\theta}) = \operatorname{Var}_\theta(\hat{\theta}) + \operatorname{sesgo}(\hat{\theta})^2.
$$
Para un estimador insesgado coincide con su varianza. Su raíz, $\sqrt{\operatorname{ECM}}$, está en las unidades del parámetro.
:::

:::nota[Qué significa cada símbolo]
- $\hat{\theta}$: estimador; $\theta$: valor verdadero.
- $\mathbb{E}_\theta$: esperanza cuando el parámetro vale $\theta$.
- $\operatorname{Var}_\theta(\hat{\theta})$: varianza del estimador; $\operatorname{sesgo}(\hat{\theta}) = \mathbb{E}_\theta[\hat{\theta}] - \theta$.
:::

## Cómo usar la visualización

Cada disparo es una estimación en dos coordenadas, y el centro de la diana es el valor verdadero. El punto grande es el promedio de los disparos. El encabezado calcula el error cuadrático medio, el promedio de la distancia al cuadrado al centro, y lo separa en varianza y sesgo al cuadrado.

Controles: **Sesgo** (qué tan lejos del centro apunta) y **Dispersión** de cada coordenada.

Experimentos sugeridos:

1. Con sesgo 0, el error cuadrático medio coincide con la varianza.
2. Subir el sesgo a 1.5 con dispersión 0.2: disparos muy agrupados, pero lejos; el error es casi todo sesgo.
3. Buscar dos combinaciones con el mismo error cuadrático medio, una con sesgo y otra sin él.

## Ejemplo

Dos estimadores de un parámetro con $\theta = 10$:

1. El estimador A es insesgado con varianza 0.50: $\operatorname{ECM}_A = 0.50$.
2. El estimador B tiene sesgo 0.30 y varianza 0.16: $\operatorname{ECM}_B = 0.16 + 0.30^2 = 0.25$.
3. B tiene la mitad del error cuadrático medio que A, aunque está sesgado.
4. En raíz: $\sqrt{0.50} \approx 0.71$ contra $\sqrt{0.25} = 0.5$ unidades del parámetro.

:::figura[El estimador B del ejemplo como diana: sesgo 0.3 y varianza total cercana a 0.16 (0.28 de dispersión en cada coordenada); el error cuadrático medio se acerca a 0.25.]{componente="EstimatorLab"}
```yaml
modo: diana
sesgo: 0.3
dispersion: 0.28
```
:::

## Propiedades

- **Combina las dos fuentes de error** en una sola cantidad, la que importa cuando se usa la estimación.
- **Es el riesgo con pérdida cuadrática:** otros criterios (error absoluto medio) llevan a otras comparaciones.
- **Depende de $\theta$:** un estimador puede ganar para unos valores del parámetro y perder para otros.

:::figura[El ECM de tres estimadores de la varianza normal: el divisor n + 1, sesgado, tiene el menor error.]{componente="EstimatorLab"}
```yaml
modo: comparar
problema: varianza-normal
n: 8
theta: 2
```
:::

## Errores comunes

- **Comparar estimadores solo por el sesgo.** Un estimador insesgado puede tener un error cuadrático medio mucho mayor que uno sesgado.
- **Olvidar que depende del parámetro.** La media contraída hacia cero gana cuando $\theta$ es cercano a cero y pierde cuando está lejos.
- **Mezclar unidades.** El ECM está en unidades al cuadrado; para interpretarlo conviene su raíz.

:::figura[La media contraída hacia cero con un valor verdadero alejado de cero: su sesgo crece y su error supera al de la media.]{componente="EstimatorLab"}
```yaml
modo: comparar
problema: media-normal
estimadores: [media, contraida]
n: 10
theta: 3
```
:::

## Conexiones

El error cuadrático medio suma la [[varianza-de-un-estimador]] y el cuadrado del [[sesgo-de-un-estimador]], como detalla la [[descomposicion-del-ecm-en-sesgo-y-varianza]]. Es la base de la [[eficiencia-relativa]] y de la [[consistencia]] en media cuadrática.

## Formulario

:::formula[Error cuadrático medio]
$$
\operatorname{ECM}(\hat{\theta}) = \mathbb{E}_\theta\big[(\hat{\theta} - \theta)^2\big]
$$

- $\hat{\theta}$: estimador; $\theta$: valor verdadero.
:::

:::formula[Descomposición]
$$
\operatorname{ECM}(\hat{\theta}) = \operatorname{Var}_\theta(\hat{\theta}) + \operatorname{sesgo}(\hat{\theta})^2
$$

- $\operatorname{Var}_\theta$: varianza del estimador; $\operatorname{sesgo}$: diferencia entre su esperanza y $\theta$.
:::

:::formula[Raíz del error cuadrático medio]
$$
\operatorname{RECM}(\hat{\theta}) = \sqrt{\operatorname{ECM}(\hat{\theta})}
$$

- Está en las mismas unidades que el parámetro.
:::
