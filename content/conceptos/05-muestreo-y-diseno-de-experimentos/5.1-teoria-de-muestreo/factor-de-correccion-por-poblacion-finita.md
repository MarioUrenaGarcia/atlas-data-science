---
id: factor-de-correccion-por-poblacion-finita
titulo: Factor de corrección por población finita
titulo_en: Finite population correction
alias:
  - FPC
  - corrección por población finita
  - fracción de muestreo
modulo: 5
submodulo: '5.1'
orden: 14
nivel: basico
prerrequisitos:
  - muestreo-con-y-sin-reemplazo
relaciones:
  - tipo: relacionado
    id: distribucion-hipergeometrica
etiquetas:
  - error estándar
  - fracción de muestreo
  - población finita
  - precisión
resumen: >
  Multiplica la varianza de la media muestral por 1 - n/N cuando se muestrea sin reemplazo de una
  población finita. Refleja que observar una parte grande de la población deja poco por adivinar.
formula: '\operatorname{EE}(\bar{y}) = \sqrt{1 - \frac{n}{N}}\;\frac{S}{\sqrt{n}}'
visualizacion:
  componente: PrecisionPlanner
  parametros:
    modo: fpc
    N: 200
    S: 12
    n: 150
    variable: Calificación en la evaluación de desempeño
    unidad: puntos
referencias:
  - clave: lohr
    capitulo: '2'
publicado: true
---

## Intuición

Una empresa tiene 200 empleados y quiere conocer la calificación promedio de su evaluación de desempeño. Si revisa 10 expedientes, la incertidumbre es la de cualquier muestra de 10. Si revisa 190, solo le faltan 10 por ver: aunque esos 10 fueran extremos, el promedio no podría moverse mucho. Y si revisa los 200, no hay nada que estimar.

La fórmula de siempre, $S/\sqrt{n}$, no distingue entre esos casos: trata cada muestra como si viniera de una población infinita. El **factor de corrección por población finita**, $\sqrt{1 - n/N}$, ajusta el error estándar para reflejar la parte de la población que ya se observó. Cuando la muestra es una fracción pequeña, el factor está muy cerca de 1 y no cambia nada; por eso una encuesta de 1000 personas tiene casi la misma precisión en una ciudad de cien mil habitantes que en un país de cien millones.

## Definición

:::definicion[Factor de corrección por población finita]
En un muestreo aleatorio simple sin reemplazo de $n$ unidades de una población de $N$, la varianza de la media muestral es
$$
\operatorname{Var}(\bar{y}) = \left(1 - \frac{n}{N}\right)\frac{S^2}{n} = \frac{N-n}{N-1}\,\frac{\sigma^2}{n}.
$$
El factor $1 - n/N$ (o $\frac{N-n}{N-1}$ cuando se usa $\sigma^2$) se llama **corrección por población finita**, y $f = n/N$ es la **fracción de muestreo**. Para el error estándar,
$$
\operatorname{EE}(\bar{y}) = \sqrt{1 - \frac{n}{N}}\;\frac{S}{\sqrt{n}}.
$$
:::

Las dos formas son la misma cantidad: $S^2 = \frac{N}{N-1}\sigma^2$, así que $\left(1 - \frac{n}{N}\right)S^2 = \frac{N - n}{N}\cdot\frac{N}{N-1}\sigma^2 = \frac{N-n}{N-1}\sigma^2$. La corrección se omite cuando el muestreo es con reemplazo o cuando la población es conceptualmente infinita, como la producción futura de una máquina.

:::nota[Qué significa cada símbolo]
- $N$: tamaño de la población; $n$: tamaño de la muestra.
- $f = n/N$: fracción de muestreo.
- $S^2$: varianza de la población con denominador $N - 1$; $\sigma^2$: con denominador $N$.
- $\operatorname{EE}(\bar{y})$: error estándar de la media muestral.
- $1 - n/N$: corrección por población finita aplicada a la varianza.
:::

## Cómo usar la visualización

La franja superior muestra los 200 empleados y, resaltados, los que entran en la muestra. La curva naranja es el error estándar sin corrección, $S/\sqrt{n}$, y la azul el error con corrección. Al reproducir, $n$ crece desde 1 hasta 150 y el encabezado calcula el factor y el error estándar.

Experimentos sugeridos:

- Observa que para $n$ pequeño las dos curvas casi coinciden.
- Lleva $n$ a 200: la curva azul llega a cero y la naranja no.
- Pon $n = 100$ y compara: la corrección reduce el error estándar en casi 30 %.

## Ejemplo

Una preparatoria tiene $N = 500$ alumnos y se encuestan $n = 100$ sobre horas de sueño; la desviación estándar es $S = 1.5$ horas.

1. Fracción de muestreo: $f = 100/500 = 0.2$.
2. Sin corrección: $\operatorname{EE} = 1.5/\sqrt{100} = 0.150$ horas.
3. Factor: $\sqrt{1 - 0.2} = 0.894$.
4. Con corrección: $\operatorname{EE} = 0.894 \cdot 0.150 = 0.134$ horas, 10.6 % menos.
5. Si la escuela tuviera 50000 alumnos, el factor sería $\sqrt{1 - 0.002} = 0.999$ y la corrección sería despreciable.

:::figura[La preparatoria del ejemplo: 100 de 500 alumnos. La corrección reduce el error estándar de 0.150 a 0.134 horas.]{componente="PrecisionPlanner"}
```yaml
modo: fpc
N: 500
S: 1.5
n: 100
franja: false
variable: Horas de sueño
unidad: h
```
:::

## Propiedades

- **Se anula cuando $n = N$**: un censo sin errores de medición no tiene error muestral. En la forma $\frac{N-n}{N-1}$ vale exactamente 1 cuando $n = 1$; en la forma $1 - n/N$ vale $1 - 1/N$, porque acompaña a $S^2$ en lugar de $\sigma^2$.
- **Es despreciable si $f < 0.05$**: el factor queda por encima de $0.97$ y suele omitirse.
- **El error estándar depende sobre todo de $n$, no de $N$**: para $N$ grande, $\operatorname{EE} \approx S/\sqrt{n}$, sin importar si la población es de cien mil o de cien millones.
- **Aparece en la hipergeométrica**: la varianza del número de éxitos sin reemplazo es la binomial multiplicada por $\frac{N-n}{N-1}$.

:::figura[Propiedad de poblaciones grandes: 400 de 5000 hogares. Las curvas casi coinciden y la corrección reduce el error estándar en solo 4 %.]{componente="PrecisionPlanner"}
```yaml
modo: fpc
N: 5000
S: 900
n: 400
franja: false
variable: Gasto mensual en luz
unidad: pesos
```
:::

## Errores comunes

- **Aplicar la corrección a un muestreo con reemplazo.** Con reemplazo las extracciones son independientes y la varianza es $\sigma^2/n$ sin importar $n/N$.
- **Aplicarla a poblaciones conceptuales.** Si se muestrean 50 piezas de lo que una máquina producirá mañana, la población de interés es el proceso, no las 200 piezas de hoy.
- **Creer que una población grande exige una muestra proporcionalmente grande.** La precisión casi no depende de $N$ cuando $N$ es grande; una muestra del 1 % de un país es mucho más precisa que una del 10 % de un pueblo.

:::figura[Error de aplicar la corrección con reemplazo: 40 extracciones con reemplazo de 48 baterías. El error estándar observado coincide con la fórmula sin corrección, no con la corregida.]{componente="SurveySampler"}
```yaml
diseno: mas
reemplazo: true
n: 40
nMaximo: 48
repeticiones: 500
poblacion:
  columnas: 8
  filas: 6
  estratos:
    - nombre: Lote
      media: 410
  desviacion: 35
  icc: 0
  decimales: 0
  variable: Duración de la batería
  unidad: h
  nombreUnidad: Batería
```
:::

## Conexiones

La corrección por población finita es el cociente entre las varianzas del [[muestreo-con-y-sin-reemplazo]] y la misma razón que separa la varianza de la [[distribucion-hipergeometrica]] de la binomial. Entra en la fórmula de varianza del [[muestreo-aleatorio-simple]], en la de cada estrato del [[muestreo-estratificado]] y en el ajuste $n = n_0/(1 + n_0/N)$ del cálculo del tamaño de muestra.

## Formulario

:::formula[Varianza con corrección]
$$
\operatorname{Var}(\bar{y}) = \left(1 - \frac{n}{N}\right)\frac{S^2}{n} = \frac{N - n}{N - 1}\,\frac{\sigma^2}{n}
$$

- $S^2$: varianza poblacional con denominador $N - 1$.
- $\sigma^2$: varianza poblacional con denominador $N$.
- $n$, $N$: tamaños de muestra y de población.
:::

:::formula[Error estándar con corrección]
$$
\operatorname{EE}(\bar{y}) = \sqrt{1 - \frac{n}{N}}\;\frac{S}{\sqrt{n}}
$$

- $\sqrt{1 - n/N}$: factor que multiplica al error estándar.
:::

:::formula[Fracción de muestreo]
$$
f = \frac{n}{N}
$$

- Si $f < 0.05$, la corrección suele omitirse.
:::
