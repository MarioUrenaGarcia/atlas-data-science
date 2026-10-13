---
id: mediana-y-moda-de-una-distribucion
titulo: Mediana y moda de una distribución
titulo_en: Median and mode of a distribution
alias:
  - mediana poblacional
  - moda poblacional
  - medidas de centro de una variable aleatoria
modulo: 1
submodulo: '1.3'
orden: 20
nivel: basico
prerrequisitos:
  - funcion-cuantil
  - esperanza-matematica
relaciones:
  - tipo: relacionado
    id: mediana
  - tipo: relacionado
    id: moda
etiquetas:
  - mediana
  - moda
  - centro de una distribución
  - robustez
  - distribución bimodal
resumen: >
  La mediana deja la mitad de la probabilidad a cada lado y la moda es el valor más probable o de mayor densidad. Con la media son las tres medidas de centro, y se separan cuando hay asimetría.
formula: 'P(X \le m) \ge \tfrac{1}{2}, \quad P(X \ge m) \ge \tfrac{1}{2}; \qquad \text{moda} = \operatorname*{arg\,max}_x\, p(x) \text{ o } f(x)'
visualizacion:
  componente: RandomVariableLab
  parametros:
    modo: forma
    distribucion: lognormal
    parametros:
      mu: 0
      sigma: 0.6
    momento: central
    orden: 2
referencias:
  - clave: blitzstein-hwang
    capitulo: '6.1'
  - clave: degroot
    capitulo: '4.5'
publicado: true
---

## Intuición

"El salario típico" puede significar tres cosas distintas. El salario **medio** es el total dividido entre el número de personas, y unos pocos salarios altísimos lo jalan hacia arriba. El salario **mediano** es el de la persona de en medio: la mitad gana menos y la mitad gana más, y los salarios extremos no lo mueven. El salario **modal** es el más frecuente, el que más personas reciben.

En una distribución simétrica con un solo pico las tres medidas coinciden. Cuando hay asimetría se separan, y cuál conviene usar depende de la pregunta: la media para totales y presupuestos, la mediana para describir a una persona típica, la moda para el escenario más probable.

## Definición

:::definicion[Mediana y moda]
Una **mediana** de una variable aleatoria $X$ es cualquier número $m$ que cumple
$$
P(X \le m) \ge \tfrac{1}{2} \quad \text{y} \quad P(X \ge m) \ge \tfrac{1}{2}.
$$
Una **moda** es un valor que maximiza la función de masa $p(x)$, si $X$ es discreta, o la densidad $f(x)$, si $X$ es continua.
:::

Si $F$ es continua y estrictamente creciente, la mediana es única: $m = F^{-1}(1/2)$. Si no, puede haber todo un intervalo de medianas, y la convención más común es tomar la función cuantil en $1/2$ o el punto medio del intervalo. Una distribución con una sola moda se llama unimodal; con dos picos, bimodal.

:::figura[La mediana como cuantil 1/2: en la lognormal la línea punteada sube a 0.5, toca la función de distribución y baja al valor 1, la mediana.]{componente="RandomVariableLab"}
```yaml
modo: acumulada
distribucion: lognormal
parametros:
  mu: 0
  sigma: 0.6
x: 1
p: 0.5
```
:::

:::nota[Qué significa cada símbolo]
- $X$: variable aleatoria.
- $m$: mediana.
- $p(x)$, $f(x)$: función de masa o densidad.
- $\operatorname*{arg\,max}$: valor donde una función alcanza su máximo.
- $F$: función de distribución.
- $c$: constante con la que se predice $X$.
- $T$: tiempo de espera del ejemplo, en minutos.
:::

## Cómo usar la visualización

La gráfica muestra una densidad lognormal, asimétrica a la derecha, con tres marcas: la moda en el pico, la mediana en el punto que divide el área en dos mitades y la media en el punto de equilibrio. El orden moda < mediana < media es el típico de las distribuciones con cola derecha larga. El panel da los tres valores: cerca de 0.70, 1 y 1.20.

Al avanzar, abajo aparecen las contribuciones a la varianza; las deslizaderas de orden y tipo de momento permiten pasar a la asimetría y a la curtosis de la misma distribución.

## Ejemplo

El tiempo de espera $T$ en una fila es exponencial con media 2 minutos: $f(t) = \tfrac{1}{2} e^{-t/2}$ para $t \ge 0$.

1. Moda: la densidad es decreciente, así que su máximo está en $t = 0$.
2. Mediana: se resuelve $1 - e^{-m/2} = 1/2$, de donde $m = 2 \ln 2 \approx 1.39$ minutos.
3. Media: 2 minutos.
4. La mitad de las personas espera menos de 1.39 minutos, aunque la espera media sea de 2: unas pocas esperas largas suben la media.

:::figura[El ejemplo de la fila: la moda está en 0, la mediana en 1.39 y la media en 2. La cola larga separa las tres medidas.]{componente="RandomVariableLab"}
```yaml
modo: forma
distribucion: exponencial
parametros:
  lambda: 0.5
momento: central
orden: 2
```
:::

## Propiedades

- **Optimalidad:** la media minimiza el error cuadrático $\mathbb{E}[(X - c)^2]$ y la mediana minimiza el error absoluto $\mathbb{E}|X - c|$.
- **Transformaciones monótonas:** si $g$ es creciente, la mediana de $g(X)$ es $g(m)$; la media no tiene esta propiedad. Por ejemplo, la mediana de la lognormal $e^{Z}$ es $e^{0} = 1$.
- **Robustez:** cambiar los valores de la cola, sin cambiar de lado de la mediana, no mueve la mediana; la media puede moverse sin límite.
- **Existencia:** toda distribución tiene mediana, aunque no tenga media; la de Cauchy tiene mediana en su centro y no tiene media.
- **Desigualdad entre media y mediana:** $|\mu - m| \le \sigma$ para cualquier distribución con varianza finita.

:::figura[En la Poisson de media 3.5 las tres medidas casi coinciden: la moda y la mediana valen 3 y la media 3.5.]{componente="RandomVariableLab"}
```yaml
modo: forma
distribucion: poisson
parametros:
  lambda: 3.5
momento: central
orden: 2
```
:::

## Errores comunes

- **Suponer que la media es un valor típico.** En una distribución bimodal la media puede caer en un valle donde casi no hay probabilidad.
- **Confundir la moda con la media.** El valor más probable de la suma de dos dados es 7 y coincide con la media, pero en el máximo de dos dados la moda es 6 y la media 4.47.
- **Exigir una mediana única.** En distribuciones discretas puede haber un intervalo de medianas: en un dado, todo número entre 3 y 4 cumple la definición.

:::figura[Una distribución bimodal: los picos están en 2 y en 6, pero la media y la mediana valen 4, un valor poco probable. Ninguna medida de centro describe bien estos datos.]{componente="RandomVariableLab"}
```yaml
modo: forma
valores: [1, 2, 3, 4, 5, 6, 7]
probabilidades: [3, 6, 3, 1, 3, 6, 3]
nombre: una variable bimodal
simbolo: X
momento: central
orden: 2
```
:::

## Conexiones

La mediana es el cuantil de orden 1/2 de la [[funcion-cuantil]], y la moda es el máximo de la [[funcion-de-masa-de-probabilidad]] o de la [[funcion-de-densidad-de-probabilidad]]. La separación entre media, mediana y moda refleja la [[asimetria]], y la comparación con la [[esperanza-matematica]] muestra el efecto de las colas. Sus versiones con datos son la [[mediana]] y la [[moda]] de la estadística descriptiva.

## Formulario

:::formula[Mediana]
$$
P(X \le m) \ge \tfrac{1}{2}, \qquad P(X \ge m) \ge \tfrac{1}{2}
$$

- Si $F$ es continua y creciente, $m = F^{-1}(1/2)$.
:::

:::formula[Moda]
$$
\text{moda} = \operatorname*{arg\,max}_x p(x) \quad \text{o} \quad \operatorname*{arg\,max}_x f(x)
$$

- Puede haber más de una.
:::

:::formula[Optimalidad]
$$
\mu = \operatorname*{arg\,min}_c \mathbb{E}[(X - c)^2], \qquad m \in \operatorname*{arg\,min}_c \mathbb{E}|X - c|
$$

- Media para error cuadrático, mediana para error absoluto.
:::

:::formula[Media y mediana]
$$
|\mu - m| \le \sigma
$$

- Para cualquier distribución con varianza finita.
:::
