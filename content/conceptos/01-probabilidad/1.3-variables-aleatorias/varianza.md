---
id: varianza
titulo: Varianza
titulo_en: Variance
alias:
  - varianza de una variable aleatoria
  - segundo momento central
  - dispersión
modulo: 1
submodulo: '1.3'
orden: 13
nivel: basico
prerrequisitos:
  - ley-del-estadistico-inconsciente
relaciones:
  - tipo: relacionado
    id: varianza-muestral
  - tipo: relacionado
    id: desviacion-estandar
etiquetas:
  - dispersión
  - distancia cuadrática
  - riesgo
  - incertidumbre
resumen: >
  La varianza mide qué tan lejos de su media suele caer una variable aleatoria: es la esperanza de
  la distancia al cuadrado entre la variable y su media. Vale 0 solo para constantes y crece con
  los valores alejados.
formula: '\operatorname{Var}(X) = \mathbb{E}\big[(X - \mu)^2\big] = \mathbb{E}[X^2] - \mu^2'
visualizacion:
  componente: RandomVariableLab
  parametros:
    modo: varianza
    experimento: dos-dados
    variable: suma
    a: 1
    b: 0
referencias:
  - clave: blitzstein-hwang
    capitulo: '4.6'
  - clave: ross-probabilidad
    capitulo: '4.5'
publicado: true
---

## Intuición

Dos inversiones pueden tener el mismo rendimiento promedio y riesgos muy distintos: una paga casi siempre lo mismo y la otra oscila entre grandes ganancias y grandes pérdidas. La media no distingue entre ellas; hace falta una medida de **dispersión**.

La idea más directa sería promediar la distancia de cada valor a la media, $|X - \mu|$. La varianza promedia en cambio el **cuadrado** de esa distancia. El cuadrado tiene dos efectos: castiga mucho más las desviaciones grandes que las pequeñas (un valor a distancia 10 pesa 100 veces más que uno a distancia 1) y produce una cantidad con propiedades algebraicas muy cómodas, sobre todo para sumas de variables independientes.

El precio es que la varianza está en unidades al cuadrado: si $X$ se mide en pesos, su varianza está en pesos al cuadrado. Para volver a las unidades originales se toma la raíz, la desviación estándar.

## Definición

:::definicion[Varianza]
Sea $X$ una variable aleatoria con media $\mu = \mathbb{E}[X]$ finita. Su **varianza** es
$$
\operatorname{Var}(X) = \mathbb{E}\big[(X - \mu)^2\big].
$$
Desarrollando el cuadrado se obtiene la fórmula equivalente
$$
\operatorname{Var}(X) = \mathbb{E}[X^2] - \mu^2.
$$
:::

También se escribe $\sigma^2$ o $\sigma_X^2$. Por la ley del estadístico inconsciente, en el caso discreto $\operatorname{Var}(X) = \sum_x (x - \mu)^2 p(x)$, y en el continuo $\int (x - \mu)^2 f(x)\,dx$.

:::figura[La varianza de una uniforme entre 0 y 1 es $1/12 \approx 0.083$. Abajo, cada franja aporta según el cuadrado de su distancia a la media 0.5: los extremos aportan mucho y el centro casi nada.]{componente="RandomVariableLab"}
```yaml
modo: varianza
distribucion: uniforme
parametros:
  a: 0
  b: 1
a: 1
b: 0
```
:::

:::nota[Qué significa cada símbolo]
- $X$: variable aleatoria.
- $\mu = \mathbb{E}[X]$: media de $X$.
- $\operatorname{Var}(X)$, $\sigma^2$: varianza de $X$.
- $(x - \mu)^2 p(x)$: contribución del valor $x$ a la varianza.
- $\mathbb{E}[X^2]$: segundo momento.
- $a$, $b$: constantes de la transformación $aX + b$.
- $R$: rendimiento de la inversión del ejemplo, en porcentaje.
:::

## Cómo usar la visualización

Arriba está la distribución de la suma de dos dados con la media 7 y la banda de una desviación estándar. En medio, cada barra es la contribución $(x - \mu)^2 p(x)$ de ese valor a la varianza; la animación las suma una a una y el encabezado muestra el total parcial. Las sumas 2 y 12 son las menos probables, pero están tan lejos de 7 que cada una aporta cinco veces más que la suma 6: $25 \cdot \tfrac{1}{36}$ contra $1 \cdot \tfrac{5}{36}$.

Abajo está $Y = aX + b$. Las deslizaderas cambian $a$ y $b$: el desplazamiento $b$ mueve la distribución sin cambiar su varianza, y la escala $a$ la multiplica por $a^2$.

## Ejemplo

El rendimiento anual $R$ de una inversión, en porcentaje, vale $-2$ con probabilidad 0.2, 4 con probabilidad 0.5 y 10 con probabilidad 0.3.

1. Media: $\mu = -2 \cdot 0.2 + 4 \cdot 0.5 + 10 \cdot 0.3 = -0.4 + 2 + 3 = 4.6$.
2. Segundo momento: $\mathbb{E}[R^2] = 4 \cdot 0.2 + 16 \cdot 0.5 + 100 \cdot 0.3 = 0.8 + 8 + 30 = 38.8$.
3. Varianza: $38.8 - 4.6^2 = 38.8 - 21.16 = 17.64$ (porcentaje al cuadrado).
4. Desviación estándar: $\sqrt{17.64} = 4.2$ puntos porcentuales.

Con la definición directa: $(-6.6)^2 \cdot 0.2 + (-0.6)^2 \cdot 0.5 + 5.4^2 \cdot 0.3 = 8.712 + 0.18 + 8.748 = 17.64$, el mismo resultado.

:::figura[El rendimiento del ejemplo: el valor 4, el más probable, está cerca de la media y casi no aporta; las contribuciones de $-2$ y de 10 forman casi toda la varianza de 17.64.]{componente="RandomVariableLab"}
```yaml
modo: varianza
valores: [-2, 4, 10]
probabilidades: [0.2, 0.5, 0.3]
nombre: el rendimiento anual en porcentaje
simbolo: R
a: 1
b: 0
```
:::

## Propiedades

- **No negativa:** $\operatorname{Var}(X) \ge 0$, con igualdad solo si $X$ es constante con probabilidad 1.
- **Transformación afín:** $\operatorname{Var}(aX + b) = a^2 \operatorname{Var}(X)$; los desplazamientos no cambian la dispersión.
- **Suma de independientes:** si $X$ y $Y$ son independientes, $\operatorname{Var}(X + Y) = \operatorname{Var}(X) + \operatorname{Var}(Y)$.
- **Mínimo cuadrático:** $\mathbb{E}[(X - c)^2] = \operatorname{Var}(X) + (\mu - c)^2$, que es mínimo cuando $c = \mu$; la media es la mejor predicción constante en error cuadrático.

:::figura[La cara de un dado transformada en $2X + 1$: la media pasa de 3.5 a 8 y la varianza de 2.917 a $4 \cdot 2.917 = 11.667$. El desplazamiento 1 no influye.]{componente="RandomVariableLab"}
```yaml
modo: varianza
experimento: dado
variable: valor
a: 2
b: 1
```
:::

## Errores comunes

- **Olvidar que las unidades están al cuadrado.** Una varianza de 17.64 no significa que los rendimientos se alejen 17.64 puntos de la media; la distancia típica es la desviación estándar, 4.2.
- **Restar varianzas.** Para $X$ y $Y$ independientes, $\operatorname{Var}(X - Y) = \operatorname{Var}(X) + \operatorname{Var}(Y)$: la diferencia también suma incertidumbre.
- **Subestimar los valores raros y lejanos.** Un valor con probabilidad 0.01 a distancia 100 aporta 100 unidades a la varianza, más que muchos valores cercanos juntos.

:::figura[Un valor raro y lejano domina: con probabilidad 0.01 la variable vale 100 y el resto del tiempo vale 0 o 1. Esa sola barra aporta casi toda la varianza, cerca de 98.]{componente="RandomVariableLab"}
```yaml
modo: varianza
valores: [0, 1, 100]
probabilidades: [0.495, 0.495, 0.01]
nombre: una variable con un valor atípico
simbolo: X
a: 1
b: 0
```
:::

## Conexiones

La varianza es la [[esperanza-matematica]] de $(X - \mu)^2$, calculada con la [[ley-del-estadistico-inconsciente]]. Su raíz es la [[desviacion-estandar]], y sus reglas de cálculo se reúnen en [[propiedades-de-la-varianza]]. Es el segundo de los [[momentos-centrales]], y con los de orden 3 y 4 se definen la [[asimetria]] y la [[curtosis]]. Su contraparte con datos es la [[varianza-muestral]]. La [[convergencia-en-media-cuadratica]] y la [[ley-debil-de-los-grandes-numeros]] usan la varianza del promedio, que decrece como $\sigma^2 / n$.

## Formulario

:::formula[Definición]
$$
\operatorname{Var}(X) = \mathbb{E}\big[(X - \mu)^2\big]
$$

- $\mu = \mathbb{E}[X]$.
:::

:::formula[Fórmula de cálculo]
$$
\operatorname{Var}(X) = \mathbb{E}[X^2] - \mu^2
$$

- Segundo momento menos el cuadrado de la media.
:::

:::formula[Casos discreto y continuo]
$$
\operatorname{Var}(X) = \sum_x (x - \mu)^2 p(x), \qquad \operatorname{Var}(X) = \int_{-\infty}^{\infty} (x - \mu)^2 f(x)\,dx
$$

- Promedio de distancias al cuadrado.
:::

:::formula[Transformación afín]
$$
\operatorname{Var}(aX + b) = a^2 \operatorname{Var}(X)
$$

- El desplazamiento $b$ no cambia la dispersión.
:::
