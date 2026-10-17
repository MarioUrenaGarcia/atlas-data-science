---
id: error-muestral-y-margen-de-error
titulo: Error muestral y margen de error
titulo_en: Sampling error and margin of error
alias:
  - margen de error
  - error de muestreo
  - más o menos
modulo: 5
submodulo: '5.1'
orden: 23
nivel: basico
prerrequisitos:
  - factor-de-correccion-por-poblacion-finita
  - teorema-central-del-limite
  - normal-estandar-y-puntuacion-z
relaciones:
  - tipo: contrasta
    id: sesgo-de-seleccion
etiquetas:
  - encuestas
  - precisión
  - nivel de confianza
  - proporciones
resumen: >
  El error muestral es la diferencia entre una estimación y el valor real que se debe solo a haber
  observado una muestra. El margen de error es la cota que ese error no supera con una confianza dada.
formula: 'E = z_{1-\alpha/2}\sqrt{\left(1 - \frac{n}{N}\right)\frac{\hat{p}(1-\hat{p})}{n}}'
visualizacion:
  componente: PrecisionPlanner
  parametros:
    modo: margen
    p: 0.42
    n: 1000
    confianza: 0.95
    encuestas: 40
    variable: Aprobación del gobierno municipal
referencias:
  - clave: lohr
    capitulo: '2'
  - clave: wasserman
publicado: true
---

## Intuición

Una encuesta de 1000 personas reporta que el 42 % aprueba al gobierno municipal, "con un margen de error de más o menos 3 puntos". Si se hubiera hecho otra encuesta igual, con otras 1000 personas sorteadas, el resultado habría sido distinto: quizá 40 %, quizá 44 %. Esa variación de una muestra a otra, que existe aunque todo se haga bien, es el **error muestral**.

El **margen de error** pone un límite a ese error: dice que, con el procedimiento usado, en 95 de cada 100 encuestas la distancia entre la estimación y el valor real no supera los 3 puntos. No dice nada de errores de otro tipo: preguntas mal redactadas, personas que no contestan, un marco incompleto. Por eso un margen de error pequeño es una condición necesaria, no suficiente, de una buena encuesta. Su tamaño depende sobre todo del número de entrevistas, y baja con la raíz cuadrada: para reducirlo a la mitad hay que cuadruplicar la muestra.

## Definición

:::definicion[Error muestral y margen de error]
El **error muestral** de un estimador $\hat{\theta}$ es $\hat{\theta} - \theta$, la diferencia con el valor poblacional atribuible a observar solo una muestra probabilística. El **margen de error** con nivel de confianza $1 - \alpha$ es
$$
E = z_{1-\alpha/2}\,\operatorname{EE}(\hat{\theta}),
$$
de modo que, en muestreo repetido, $P(|\hat{\theta} - \theta| \le E) \approx 1 - \alpha$.
:::

Para una proporción estimada con muestreo aleatorio simple, el teorema central del límite justifica la aproximación normal y
$$
E = z_{1-\alpha/2}\sqrt{\left(1 - \frac{n}{N}\right)\frac{\hat{p}(1-\hat{p})}{n}}.
$$
Con $\hat{p} = 0.5$ se obtiene el margen máximo para un $n$ dado; las encuestas suelen reportarlo así. El intervalo $\hat{p} \pm E$ es un intervalo de confianza aproximado, y la aproximación empeora cuando $n\hat{p}$ o $n(1 - \hat{p})$ son pequeños.

:::nota[Qué significa cada símbolo]
- $\theta$: valor real en la población; $\hat{\theta}$: su estimación con la muestra.
- $\operatorname{EE}(\hat{\theta})$: error estándar del estimador.
- $1 - \alpha$: nivel de confianza, por ejemplo $0.95$.
- $z_{1-\alpha/2}$: cuantil de la normal estándar; vale $1.645$, $1.960$ y $2.576$ para 90 %, 95 % y 99 %.
- $\hat{p}$: proporción estimada; $n$: tamaño de muestra; $N$: tamaño de la población.
- $E$: margen de error.
:::

## Cómo usar la visualización

Cada barra horizontal es una encuesta simulada de 1000 personas: el punto es su estimación y la barra va de la estimación menos el margen a la estimación más el margen. La línea azul vertical es la aprobación real. Las barras verdes contienen el valor real y las naranjas no. Al reproducir aparecen 40 encuestas.

Experimentos sugeridos:

- Cuenta las barras naranjas: alrededor de 2 de cada 40, el 5 % que corresponde al 95 % de confianza.
- Baja $n$ a 250: las barras se alargan al doble.
- Cambia la confianza a 99 %: las barras se alargan y casi todas contienen el valor real.

## Ejemplo

Una encuesta nacional entrevista a $n = 1000$ personas y obtiene $\hat{p} = 0.5$.

1. Error estándar: $\sqrt{0.5 \cdot 0.5/1000} = 0.0158$.
2. Margen al 95 %: $1.96 \cdot 0.0158 = 0.031$, es decir, 3.1 puntos.
3. La población es de decenas de millones, así que $1 - n/N \approx 1$ y la corrección no cambia nada.
4. Con $n = 4000$ el margen sería $1.96\sqrt{0.25/4000} = 0.0155$: la mitad, con cuatro veces más entrevistas.
5. Si la diferencia entre dos candidatos es de 2 puntos, cada uno con margen de 3.1, la diferencia no es concluyente: su propio margen es mayor que el de cada proporción.

:::figura[La encuesta del ejemplo: 40 repeticiones de 1000 entrevistas con una proporción real de 50 %. Cada margen mide alrededor de 3.1 puntos.]{componente="PrecisionPlanner"}
```yaml
modo: margen
p: 0.5
n: 1000
confianza: 0.95
encuestas: 40
variable: Intención de voto por el candidato A
```
:::

## Propiedades

- **Baja con la raíz de $n$**: $E \propto 1/\sqrt{n}$.
- **Es máximo con $p = 0.5$** y menor para proporciones cercanas a 0 o 1.
- **Sube con el nivel de confianza**: pasar de 95 % a 99 % multiplica el margen por $2.576/1.960 = 1.31$.
- **Solo cubre el error muestral**: los sesgos de marco, de no respuesta o de medición se suman y no se reflejan en $E$.
- **En diseños complejos se multiplica por $\sqrt{\text{deff}}$**.

:::figura[Propiedad de la raíz de n: con 250 entrevistas por encuesta las barras miden el doble que con 1000.]{componente="PrecisionPlanner"}
```yaml
modo: margen
p: 0.42
n: 250
confianza: 0.95
encuestas: 40
variable: Aprobación del gobierno municipal
```
:::

:::figura[Propiedad del nivel de confianza: con 99 % las barras son 31 % más largas y es raro que alguna no contenga el valor real.]{componente="PrecisionPlanner"}
```yaml
modo: margen
p: 0.42
n: 1000
confianza: 0.99
encuestas: 40
variable: Aprobación del gobierno municipal
```
:::

## Errores comunes

- **Creer que el margen cubre todos los errores.** Una encuesta en línea con 10000 respuestas autoseleccionadas tiene un margen de error minúsculo y un sesgo que puede ser enorme.
- **Usar el margen de una proporción para una diferencia.** El margen de la diferencia entre dos proporciones de la misma encuesta es mayor que el de cada una.
- **Aplicar la fórmula con proporciones extremas y muestras chicas.** Si $n\hat{p} < 10$, el intervalo $\hat{p} \pm E$ cubre el valor real bastante menos del 95 % de las veces.
- **Decir que hay 95 % de probabilidad de que el valor real esté en este intervalo.** El 95 % describe el procedimiento en muestreo repetido, no un intervalo ya calculado.

:::figura[Error con proporciones extremas: encuestas de 60 personas sobre una enfermedad con prevalencia de 5 %. Varias barras se quedan cortas o incluso miden cero, y la cobertura queda por debajo de 95 %.]{componente="PrecisionPlanner"}
```yaml
modo: margen
p: 0.05
n: 60
confianza: 0.95
encuestas: 60
variable: Prevalencia de la enfermedad
```
:::

## Conexiones

El margen de error es el [[teorema-central-del-limite]] aplicado a una muestra: el cuantil de la [[normal-estandar-y-puntuacion-z|normal estándar]] multiplicado por el error estándar, con el [[factor-de-correccion-por-poblacion-finita]] cuando la muestra es una fracción grande de la población. Mide solo el error aleatorio; los errores sistemáticos como el [[sesgo-de-seleccion]] requieren otro análisis. Invertir su fórmula da el tamaño de muestra necesario para una precisión deseada.

## Formulario

:::formula[Margen de error general]
$$
E = z_{1-\alpha/2}\,\operatorname{EE}(\hat{\theta})
$$

- $z_{1-\alpha/2}$: cuantil de la normal estándar para la confianza $1 - \alpha$.
- $\operatorname{EE}(\hat{\theta})$: error estándar del estimador.
:::

:::formula[Margen de error de una proporción]
$$
E = z_{1-\alpha/2}\sqrt{\left(1 - \frac{n}{N}\right)\frac{\hat{p}(1-\hat{p})}{n}}
$$

- $\hat{p}$: proporción estimada; $n$: tamaño de muestra; $N$: tamaño de la población.
:::

:::formula[Margen de error de una media]
$$
E = z_{1-\alpha/2}\sqrt{\left(1 - \frac{n}{N}\right)\frac{s^2}{n}}
$$

- $s^2$: varianza muestral.
:::

:::formula[Margen máximo para una proporción]
$$
E_{\max} = z_{1-\alpha/2}\sqrt{\frac{0.25}{n}} \approx \frac{0.98}{\sqrt{n}} \quad \text{al 95 \%}
$$

- Se obtiene con $\hat{p} = 0.5$, el valor que maximiza $\hat{p}(1 - \hat{p})$.
:::
